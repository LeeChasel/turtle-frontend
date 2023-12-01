import { useForm, SubmitHandler, Controller, useFieldArray } from "react-hook-form";
import { GiCancel } from 'react-icons/gi';
import clsx from "clsx";
import { showToast } from "../../utils/toastAlert";
import getProductByName from "../../actions/getProductByName";
import addProduct from "../../actions/addProduct";
import useUserTokenCookie from "../../hooks/useUserTokenCookie";
import type { TProduct, TImage, TVariation, TImageData } from "../../types/Product";
import { getImageData } from "../../utils/processFile";

type VariationData = {
  variationName: string;
  variationSpec: string;
  originalPrice?: number;
  currentPrice?: number;
  available?: boolean;
  stock?: number;
  bannerImage: File | null
}

type FormInputs = {
  productName: string,
  productDescription?: string,
  originalPrice?: number,
  currentPrice?: number,
  stock?: number,
  available?: boolean,
  productUpstreamUrl?: string,
  bannerImage?: FileList,
  previewImage?: TImageData[],
  detailImage: TImageData[],
  variation: VariationData[]
};

const variationDefaultValue = {
  variationName: "",
  variationSpec: "",
  originalPrice: 0,
  currentPrice: 0,
  available: true,
  stock: 0,
  bannerImage: null
}

const formDefaultValue: FormInputs = {
  productName: "",
  originalPrice: 0,
  currentPrice: 0,
  stock: 0,
  available: true,
  detailImage: [{ description:"", image: null}],
  variation: [variationDefaultValue]
}

function AddProducts() {
  const { register, handleSubmit, formState: { isSubmitting, errors }, reset, control } = useForm<FormInputs>({
    mode: "onBlur",
    defaultValues: formDefaultValue
  });

  const { fields: previewField, append: appendPreview, remove: removePreview } = useFieldArray({
    control,
    name: 'previewImage'
  });

  const { fields: detailField, append: appendDetail, remove: removeDetail } = useFieldArray({
    control,
    name: 'detailImage'
  });

  const { fields: variationField, append: appendVariation, remove: removeVariation } = useFieldArray({
    control,
    name: 'variation'
  });

  const { tokenCookie } = useUserTokenCookie();

  const onSubmit: SubmitHandler<FormInputs> = async (formData) => {
    try {
      const validateName = await getProductByName(formData.productName);
      if (validateName.length !== 0) {
        throw new Error(`商品「${formData.productName}」已經登記，無法重新登記`);
      }
  
      const productData: TProduct = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        originalPrice: formData.originalPrice,
        currentPrice: formData.currentPrice,
        stock: formData.stock,
        available: formData.available,
        productUpstreamUrl: formData.productUpstreamUrl
      }

      // process bannerImage
      const updateBannerImage = await getImageData({ image: formData.bannerImage![0] }, tokenCookie!);
      productData.bannerImage = updateBannerImage;

      // process previewImage
      if (formData.previewImage !== undefined && formData.previewImage.length > 0) {
        const files = formData.previewImage.filter(item => item.image !== null);
        await updateImages(files, productData, "previewImage", tokenCookie!);
      }

      // process detailImage
      const detailImagesData = formData.detailImage.filter(item => !(item.description === "" && item.image === null));
      await updateImages(detailImagesData, productData, "detailImage", tokenCookie!);

      // process variation
      const variationDataArray = await processVariationArraySequentially(formData.variation, tokenCookie!);
      productData.variation = variationDataArray;

      const addProductResult = await sendRequest(productData, tokenCookie);
      showToast("success", `商品「${addProductResult.productName}」新增成功!`);

      // Success will rest the form, if fail will throw error and don't trigger reset
      reset();
    } catch (error) {
      if (error instanceof Error) {
        showToast('error', error.message);
      }
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-4 gap-3 p-5 bg-gray-200">
      {/* ProductName */}
      <div className="col-span-2 form-control">
        <label className="label">
          <span>
            <span>商品名稱</span>
            <span className="text-red-700">*</span>
          </span>
        </label>
        <input type="text" {...register("productName", { required: "商品名稱必填!" })} className="input input-bordered" />
        {errors.productName && <label className="justify-end label label-text-alt text-error">{errors.productName.message}</label>}
      </div>
      
      {/* productUpstreamUrl */}
      <div className="col-span-2 form-control">
        <label className="label"><span>商品來源連結</span></label>
        <input type="url" {...register("productUpstreamUrl")} className="input input-bordered" />
      </div>

      {/* productDescription */}
      <div className="form-control col-span-full">
        <label className="label">商品描述</label>
        <textarea {...register("productDescription")} className="h-24 resize-none textarea textarea-bordered"/>
      </div>

      {/* originalPrice */}
      <div className="form-control">
        <label className="label"><span>商品原價</span></label>
        <input type="number" {...register("originalPrice", {valueAsNumber: true, required: "商品原價至少填入0"})} min="0" className="input input-bordered" />
        {errors.originalPrice && <label className="justify-end label label-text-alt text-error">{errors.originalPrice.message}</label>}
      </div>

      {/* currentPrice */}
      <div className="form-control">
        <label className="label"><span>商品現價</span></label>
        <input type="number" {...register("currentPrice", {valueAsNumber: true, required: "商品現價至少填入0"})} min="0" className="input input-bordered"/>
        {errors.currentPrice && <label className="justify-end label label-text-alt text-error">{errors.currentPrice.message}</label>}
      </div>

      {/* stock */}
      <div className="form-control">
        <label className="label"><span>商品存貨</span></label>
        <input type="number" {...register("stock", {valueAsNumber: true, required: "商品存貨至少填入0"})} min="0" className="input input-bordered"/>
        {errors.stock && <label className="justify-end label label-text-alt text-error">{errors.stock.message}</label>}
      </div>

      {/* bannerImage */}
      <div className="col-span-2 form-control">
        <label className="label">
          <span>
            <span>首頁縮圖</span>
            <span className="text-red-700">*</span>
          </span>
        </label>
        <input type="file" accept=".webp, .avif" {...register("bannerImage", {required: "首頁縮圖必填!"})} className="file-input file-input-bordered" />
        {errors.bannerImage && <label className="justify-end label label-text-alt text-error">{errors.bannerImage.message}</label>}
      </div>
      
      {/* available */}
      <div className="col-span-2 form-control self-end w-full border-[1px] rounded-lg border-opacity-20 bg-base-100 border-black ">
        <label className="cursor-pointer label">
          <span className="text-lg label-text">目前可購買</span> 
          <input type="checkbox" {...register("available")} className="checkbox checkbox-lg" />
        </label>
      </div>

      <div className="divider col-span-full"/>

      {/* previewImage */}
      <div className="col-span-2 form-control">
        <div className="label">
          <div>商品頁面預覽圖</div>
          <button type="button" onClick={() => appendPreview({ image: null })} className="btn btn-ghost btn-sm">新增圖片</button>
        </div>
        <ul>
        {previewField.map((item, index) => (
          <li key={item.id} className="flex flex-col gap-1 mt-2">
            <div className="badge badge-primary badge-outline badge-lg">第{index + 1}個預覽圖</div>
            <Controller
              name={`previewImage.${index}.image` as const}
              control={control}
              rules={{required: "必須上傳圖片，否則刪除"}}
              render={({ field: { onChange }, fieldState: {error} }) => (
                <>
                  <div className="flex items-center">
                    <input
                      onChange={e => onChange(e.target.files ? e.target.files[0] : null)}
                      type="file"
                      accept=".webp, .avif"
                      className="file-input file-input-bordered grow"
                    />
                    <button type="button" onClick={() => removePreview(index)} className="btn btn-square btn-ghost">
                      <GiCancel className="w-7 h-7"/>
                    </button>
                  </div>
                  {error && <label className="justify-end label label-text-alt text-error">{error.message}</label>}
                </>
              )}
            />
          </li>
        ))}
        </ul>
      </div>

      {/* detailImage */}
      <div className="col-span-2 form-control">
        <div className="label">
          <span>
            <span>商品頁面詳細圖</span>
            <span className="text-red-700">*</span>
          </span>
          <button onClick={() => appendDetail({description: "", image: null })} type="button" className="btn btn-ghost btn-sm">新增欄位</button>
        </div>
        <ul>
        {detailField.map((item, index) => (
          <li key={item.id} className="flex flex-col gap-1 mt-2">
            <div className="flex items-center justify-between">
              <span className="badge badge-primary badge-outline badge-lg">第{index + 1}個詳細圖文欄位</span>
              {index > 0 && 
                <button onClick={() => removeDetail(index)} className="btn btn-square btn-ghost">
                  <GiCancel className="w-7 h-7"/>
                </button>}
            </div>
              <Controller
                name={`detailImage.${index}.image` as const}
                control={control}
                render={({ field: { onChange }}) => (
                  <input
                    onChange={e => onChange(e.target.files ? e.target.files[0] : null)}
                    type="file"
                    accept=".webp, .avif"
                    className="file-input file-input-bordered"
                  />
                )}
              />
              <Controller
                name={`detailImage.${index}.description` as const}
                control={control}
                rules={{ required: index === 0 ? "至少填寫一段文字敘述" : false }}
                render={({ field: { value, onChange }, fieldState: {error} }) => (
                  <>
                    <textarea
                      value={value}
                      onChange={onChange}
                      className="h-24 resize-none textarea textarea-bordered"
                    />
                    {error && <label className="justify-end label label-text-alt text-error">{error.message}</label>}
                  </>
                )}
              />
          </li>
        ))}
        </ul>
      </div>

      {/* variation */}
      <div className="form-control col-span-full">
        <div className="label">
          <span>
            <span>商品規格</span>
            <span className="text-red-700">*</span>
          </span>
          <button onClick={() => appendVariation(variationDefaultValue, {shouldFocus: false})} type="button" className="btn btn-ghost btn-sm">新增規格欄位</button>
        </div>
        <ul>
        {variationField.map((item, index) => (
          <li key={item.id} className="grid grid-cols-4 gap-3">
            <div className="flex items-center justify-between col-span-full">
              <span className="badge badge-primary badge-outline badge-lg">第{index + 1}個規格欄位</span>
              {index > 0 && 
                <button onClick={() => removeVariation(index)} className="btn btn-square btn-ghost">
                  <GiCancel className="w-7 h-7"/>
                </button>}
            </div>
            {/* first column */}
            <Controller
              name={`variation.${index}.variationName` as const}
              control={control}
              rules={{ required: "種類名稱必填" }}
              render={({ field, fieldState: { error } }) => (
                <div className="w-full">
                  <label className="label label-text">
                    <span>
                      <span>種類名稱</span>
                      <span className="text-red-700">*</span>
                    </span> 
                  </label>
                  <input
                    {...field}
                    type="text"
                    className="w-full input input-bordered"
                  />
                  {error && <label className="justify-end label label-text-alt text-error">{error.message}</label>}
                </div>
              )}
            />
            <Controller
              name={`variation.${index}.variationSpec` as const}
              control={control}
              rules={{ required: "種類規格必填" }}
              render={({ field, fieldState: { error } }) => (
                <div className="w-full">
                  <label className="label label-text">
                    <span>
                      <span>種類規格</span>
                      <span className="text-red-700">*</span>
                    </span> 
                  </label>
                  <input
                    {...field}
                    type="text"
                    className="w-full input input-bordered"
                  />
                  {error && <label className="justify-end label label-text-alt text-error">{error.message}</label>}
                </div>
              )}
            />
            <Controller
              name={`variation.${index}.originalPrice` as const}
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <label className="label label-text">商品原價</label>
                  <input
                    {...field}
                    type="number"
                    min={0}
                    className="w-full input input-bordered"
                    onChange={e => field.onChange(parseInt(e.target.value || "0"))}
                  />
                </div>
              )}
            />
            <Controller
              name={`variation.${index}.currentPrice` as const}
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <label className="label label-text">商品現價</label>
                  <input
                    {...field}
                    type="number"
                    min={0}
                    className="w-full input input-bordered"
                    onChange={e => field.onChange(parseInt(e.target.value || "0"))}
                  />
                </div>
              )}
            />

            {/* second column */}
            <Controller
              name={`variation.${index}.stock` as const}
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <label className="label label-text">商品存貨</label>
                  <input
                    {...field}
                    type="number"
                    min={0}
                    className="w-full input input-bordered"
                    onChange={e => field.onChange(parseInt(e.target.value || "0"))}
                  />
                </div>
              )}
            />
            <Controller
              name={`variation.${index}.bannerImage` as const}
              control={control}
              rules={{required: "必須上傳圖片"}}
              render={({ field: { onChange }, fieldState: {error} }) => (
                <div className="col-span-2">
                  <label className="label">
                    <span>
                      <span>首頁縮圖</span>
                      <span className="text-red-700">*</span>
                    </span>
                  </label>
                    <input
                      onChange={e => onChange(e.target.files ? e.target.files[0] : null)}
                      type="file"
                      accept=".webp, .avif"
                      className="w-full file-input file-input-bordered"
                    />
                  {error && <label className="justify-end label label-text-alt text-error">{error.message}</label>}
                </div>
              )}
            />
            <div className="self-end w-full border-[1px] rounded-lg border-opacity-20 bg-base-100 border-black form-control">
              <label className="cursor-pointer label">
                <span className="text-lg label-text">目前可購買</span> 
                <input type="checkbox" {...register(`variation.${index}.available`)} className="checkbox checkbox-lg" />
              </label>
            </div>
            <div className="divider col-span-full"/>
          </li>
        ))}
        </ul>
      </div>

      <button 
        className={clsx(
          "col-span-2 col-start-2 btn btn-primary",
          isSubmitting && "btn-disabled"
        )}>
        {isSubmitting ? (
          <>
          <span className="loading loading-spinner"/>
          處理中
          </>) : "新增商品"}
      </button>
    </form>
  )
}

async function updateImages(data: TImageData[], productData: TProduct, key: keyof TProduct, token: string)
{ 
  // update file sequentially
  const processArraySequentially = async (arrayData: TImageData[]) => {
    const images: TImage[] = [];
    for (const file of arrayData) {
      const imageResult = await getImageData(file, token);
      if (imageResult) images.push(imageResult);
    }
    return images;
  }

  const imagesData = await processArraySequentially(data);
  switch(key)
  {
    case "previewImage":
      productData[key] = imagesData;
      break;
    case "detailImage":
      productData[key] = imagesData;
      break;
  }
}

async function processVariationArraySequentially(variationDataArray: VariationData[], token: string) {
  const variationData: TVariation[] = [];
  for(const variation of variationDataArray)
  {
    const bannerImage = await getImageData({ image: variation.bannerImage }, token);
    const result: TVariation = {
      variationName: variation.variationName,
      variationSpec: variation.variationSpec,
      originalPrice: variation.originalPrice,
      currentPrice: variation.currentPrice,
      available: variation.available,
      stock: variation.stock,
      bannerImage: bannerImage,
    };
    variationData.push(result);
  }
  return variationData;
}

async function sendRequest(data: TProduct, token: string | undefined) {
  const json = await addProduct(token!, data);
  return json;
}


export default AddProducts;