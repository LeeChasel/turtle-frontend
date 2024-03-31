import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { GiCancel } from "react-icons/gi";
import clsx from "clsx";
import { showToast } from "../../utils/toastAlert";
import getProductByName from "../../actions/getProductByName";
import addProduct from "../../actions/addProduct";
import useUserTokenCookie from "../../hooks/useUserTokenCookie";
import type {
  TProduct,
  TImage,
  TVariation,
  TImageData,
} from "../../types/Product";
import { getImageData } from "../../utils/processFile";
import { isEmpty, map, uniq } from "lodash";
import getUserByEmail from "@/actions/getUserByEmail";
import {
  CustomizationDetail,
  CustomizationType,
} from "@/types/Customization/CustomizationBase";
import { useState } from "react";
import Select from "react-select";
import mimeTypes from "@/data/mimeTypes.json";

type VariationData = {
  variationName: string;
  variationSpec: string;
  originalPrice?: number;
  currentPrice?: number;
  available?: boolean;
  stock?: number;
  bannerImage: File | null;
};

type FormInputs = {
  productName: string;
  productDescription?: string;
  originalPrice?: number;
  currentPrice?: number;
  stock?: number;
  available?: boolean;
  productUpstreamUrl?: string;
  bannerImage?: FileList;
  previewImages?: TImageData[];
  detailImages: TImageData[];
  variations: VariationData[];
  customizations?: CustomizationDetail[];
  relatedProducts?: {
    productName: string;
  }[];
  merchantEmail: string;
};

const variationDefaultValue = {
  variationName: "",
  variationSpec: "",
  originalPrice: 0,
  currentPrice: 0,
  available: true,
  stock: 0,
  bannerImage: null,
};

const formDefaultValue: FormInputs = {
  productName: "",
  originalPrice: 0,
  currentPrice: 0,
  stock: 0,
  available: true,
  detailImages: [{ description: "", image: null }],
  variations: [variationDefaultValue],
  merchantEmail: "",
};

function AddProducts() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    control,
  } = useForm<FormInputs>({
    mode: "onBlur",
    defaultValues: formDefaultValue,
  });

  const {
    fields: previewField,
    append: appendPreview,
    remove: removePreview,
  } = useFieldArray({
    control,
    name: "previewImages",
  });

  const {
    fields: detailField,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({
    control,
    name: "detailImages",
  });

  const {
    fields: variationField,
    append: appendVariation,
    remove: removeVariation,
  } = useFieldArray({
    control,
    name: "variations",
  });

  const {
    fields: relativeProductField,
    append: appendRelativeProduct,
    remove: removeRelativeProduct,
  } = useFieldArray({
    control,
    name: "relatedProducts",
  });

  const {
    fields: customizationField,
    append: appendCustomization,
    remove: removeCustomization,
  } = useFieldArray({
    control,
    name: "customizations",
  });

  const { tokenCookie } = useUserTokenCookie();
  const [customizationType, setCustomizationType] = useState<CustomizationType>(
    CustomizationType.SIMPLEFILES,
  );
  const customizationTypeOptions = Object.values(CustomizationType);
  const mimeTypesOptions = map(mimeTypes, (value, key) => ({
    value: value.mime,
    label: key,
  }));

  const onSubmit: SubmitHandler<FormInputs> = async (formData) => {
    try {
      // Todo: move validation to ui validation, not here
      // validate customizations are the same media type
      if (formData.customizations) {
        formData.customizations.forEach((customizationItem) => {
          if (customizationItem.type === CustomizationType.SIMPLEFILES) {
            const fileMimeTypes =
              customizationItem.customization.fileRequirePara.fileMimeTypes;
            // check if all fileMimeTypes are the same media type
            const mediaType = fileMimeTypes[0].split("/")[0];
            const isAllSameMediaType = fileMimeTypes.every(
              (mimeType) => mimeType.split("/")[0] === mediaType,
            );
            if (!isAllSameMediaType) {
              throw new Error("檔案格式必須為同一類型(圖片、音訊、影片)");
            }
          }
        });
      }

      // check productName is exited or not
      const validateName = await getProductByName(formData.productName);
      if (validateName.length !== 0) {
        throw new Error(
          `商品「${formData.productName}」已經登記，無法重新登記`,
        );
      }

      // check productNames in relatedProducts are exited or not
      const relatedProductIds = await Promise.all(
        uniq(formData.relatedProducts).map(async (item) => {
          const productsData = await getProductByName(item.productName);
          if (productsData.length === 0) {
            throw new Error(`相關商品「${item.productName}」不存在`);
          }
          return productsData[0].productId!;
        }),
      );

      let merchantId = "";
      if (formData.merchantEmail.trim() !== "") {
        const userData = await getUserByEmail(
          tokenCookie!,
          formData.merchantEmail,
        );
        merchantId = userData.id;
      }

      const productData: TProduct = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        originalPrice: formData.originalPrice,
        currentPrice: formData.currentPrice,
        stock: formData.stock,
        available: formData.available,
        productUpstreamUrl: formData.productUpstreamUrl,
        relatedProducts: relatedProductIds,
        customizations: formData.customizations ?? [],
        ...(merchantId && { merchantId }),
      };

      // process bannerImage
      const updateBannerImage = await getImageData({
        image: formData.bannerImage![0],
      });
      productData.bannerImage = updateBannerImage;

      // process previewImage
      if (
        formData.previewImages !== undefined &&
        formData.previewImages.length > 0
      ) {
        const files = formData.previewImages.filter(
          (item) => item.image !== null,
        );
        await updateImages(files, productData, "previewImages");
      }

      // process detailImage
      const detailImagesData = formData.detailImages.filter(
        (item) => !(item.description === "" && item.image === null),
      );
      await updateImages(detailImagesData, productData, "detailImages");

      // process variation
      const variationDataArray = await processVariationArraySequentially(
        formData.variations,
      );
      productData.variations = variationDataArray;

      const addProductResult = await sendRequest(productData, tokenCookie);
      showToast("success", `商品「${addProductResult.productName}」新增成功!`);

      // Success will rest the form, if fail will throw error and don't trigger reset
      reset();
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  };

  const addCustomizationField = () => {
    switch (customizationType) {
      case CustomizationType.SIMPLEFILES:
        appendCustomization({
          name: "",
          required: false,
          type: CustomizationType.SIMPLEFILES,
          customization: {
            price: 0,
            fileRequirePara: {
              fileMimeTypes: [],
              minRequiredfilesCount: 0,
              maxRequiredfilesCount: 0,
            },
          },
        });
        break;
      default:
        throw new Error("不支援的客製化類型");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-4 gap-3 p-5 bg-gray-200"
    >
      {/* ProductName */}
      <div className="col-span-2 form-control">
        <label className="label">
          <span>
            <span>商品名稱</span>
            <span className="text-red-700">*</span>
          </span>
        </label>
        <input
          type="text"
          {...register("productName", {
            validate: (value) => !isEmpty(value.trim()) || "商品名稱必填！",
          })}
          className="input input-bordered"
        />
        {errors.productName && (
          <label className="justify-end label label-text-alt text-error">
            {errors.productName.message}
          </label>
        )}
      </div>

      {/* productUpstreamUrl */}
      <div className="col-span-2 form-control">
        <label className="label">
          <span>商品來源連結</span>
        </label>
        <input
          type="url"
          {...register("productUpstreamUrl")}
          className="input input-bordered"
        />
      </div>

      {/* productDescription */}
      <div className="form-control col-span-full">
        <label className="label">商品描述</label>
        <textarea
          {...register("productDescription")}
          className="h-24 resize-none textarea textarea-bordered"
        />
      </div>

      {/* originalPrice */}
      <div className="form-control">
        <label className="label">
          <span>商品原價</span>
        </label>
        <input
          type="number"
          {...register("originalPrice", {
            valueAsNumber: true,
            required: "商品原價至少填入0",
          })}
          min="0"
          className="input input-bordered"
        />
        {errors.originalPrice && (
          <label className="justify-end label label-text-alt text-error">
            {errors.originalPrice.message}
          </label>
        )}
      </div>

      {/* currentPrice */}
      <div className="form-control">
        <label className="label">
          <span>商品現價</span>
        </label>
        <input
          type="number"
          {...register("currentPrice", {
            valueAsNumber: true,
            required: "商品現價至少填入0",
          })}
          min="0"
          className="input input-bordered"
        />
        {errors.currentPrice && (
          <label className="justify-end label label-text-alt text-error">
            {errors.currentPrice.message}
          </label>
        )}
      </div>

      {/* stock */}
      <div className="form-control">
        <label className="label">
          <span>商品存貨</span>
        </label>
        <input
          type="number"
          {...register("stock", {
            valueAsNumber: true,
            required: "商品存貨至少填入0",
          })}
          min="0"
          className="input input-bordered"
        />
        {errors.stock && (
          <label className="justify-end label label-text-alt text-error">
            {errors.stock.message}
          </label>
        )}
      </div>

      {/* 賣家 */}
      <div className="form-control">
        <div className="label">
          <span>賣家 （Email）</span>
          <span>Admin留空</span>
        </div>
        <input
          type="email"
          {...register("merchantEmail")}
          className="input input-bordered"
        />
      </div>

      {/* bannerImage */}
      <div className="col-span-2 form-control">
        <label className="label">
          <span>
            <span>首頁縮圖</span>
            <span className="text-red-700">*</span>
          </span>
        </label>
        <input
          type="file"
          accept=".webp, .avif"
          {...register("bannerImage", { required: "首頁縮圖必填!" })}
          className="file-input file-input-bordered"
        />
        {errors.bannerImage && (
          <label className="justify-end label label-text-alt text-error">
            {errors.bannerImage.message}
          </label>
        )}
      </div>

      {/* available */}
      <div className="col-span-2 form-control self-end w-full border-[1px] rounded-lg border-opacity-20 bg-base-100 border-black ">
        <label className="cursor-pointer label">
          <span className="text-lg label-text">目前可購買</span>
          <input
            type="checkbox"
            {...register("available")}
            className="checkbox checkbox-lg"
          />
        </label>
      </div>

      <div className="divider col-span-full" />

      {/* previewImage */}
      <div className="col-span-2 form-control">
        <div className="label">
          <div>商品頁面預覽圖</div>
          <button
            type="button"
            onClick={() => appendPreview({ image: null })}
            className="btn btn-ghost btn-sm"
          >
            新增圖片
          </button>
        </div>
        <ul>
          {previewField.map((item, index) => (
            <li key={item.id} className="flex flex-col gap-1 mt-2">
              <div className="badge badge-primary badge-outline badge-lg">
                第{index + 1}個預覽圖
              </div>
              <Controller
                name={`previewImages.${index}.image` as const}
                control={control}
                rules={{ required: "必須上傳圖片，否則刪除" }}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <>
                    <div className="flex items-center">
                      <input
                        onChange={(e) =>
                          onChange(e.target.files ? e.target.files[0] : null)
                        }
                        type="file"
                        accept=".webp, .avif"
                        className="file-input file-input-bordered grow"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(index)}
                        className="btn btn-square btn-ghost"
                      >
                        <GiCancel className="w-7 h-7" />
                      </button>
                    </div>
                    {error && (
                      <label className="justify-end label label-text-alt text-error">
                        {error.message}
                      </label>
                    )}
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
          <button
            onClick={() => appendDetail({ description: "", image: null })}
            type="button"
            className="btn btn-ghost btn-sm"
          >
            新增欄位
          </button>
        </div>
        <ul>
          {detailField.map((item, index) => (
            <li key={item.id} className="flex flex-col gap-1 mt-2">
              <div className="flex items-center justify-between">
                <span className="badge badge-primary badge-outline badge-lg">
                  第{index + 1}個詳細圖文欄位
                </span>
                {index > 0 && (
                  <button
                    onClick={() => removeDetail(index)}
                    className="btn btn-square btn-ghost"
                  >
                    <GiCancel className="w-7 h-7" />
                  </button>
                )}
              </div>
              <Controller
                name={`detailImages.${index}.image` as const}
                control={control}
                render={({ field: { onChange } }) => (
                  <input
                    onChange={(e) =>
                      onChange(e.target.files ? e.target.files[0] : null)
                    }
                    type="file"
                    accept=".webp, .avif"
                    className="file-input file-input-bordered"
                  />
                )}
              />
              <Controller
                name={`detailImages.${index}.description` as const}
                control={control}
                rules={{
                  validate: (value) => {
                    if (index === 0) {
                      return !isEmpty(value!.trim()) || "第一個敘述為必填";
                    }
                  },
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <>
                    <textarea
                      value={value}
                      onChange={onChange}
                      className="h-24 resize-none textarea textarea-bordered"
                    />
                    {error && (
                      <label className="justify-end label label-text-alt text-error">
                        {error.message}
                      </label>
                    )}
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
          <button
            onClick={() =>
              appendVariation(variationDefaultValue, { shouldFocus: false })
            }
            type="button"
            className="btn btn-ghost btn-sm"
          >
            新增規格欄位
          </button>
        </div>
        <ul>
          {variationField.map((item, index) => (
            <li key={item.id} className="grid grid-cols-4 gap-3">
              <div className="flex items-center justify-between col-span-full">
                <span className="badge badge-primary badge-outline badge-lg">
                  第{index + 1}個規格欄位
                </span>
                {index > 0 && (
                  <button
                    onClick={() => removeVariation(index)}
                    className="btn btn-square btn-ghost"
                  >
                    <GiCancel className="w-7 h-7" />
                  </button>
                )}
              </div>
              {/* first column */}
              <Controller
                name={`variations.${index}.variationName` as const}
                control={control}
                rules={{
                  validate: (value) => !isEmpty(value.trim()) || "種類名稱必填",
                }}
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
                    {error && (
                      <label className="justify-end label label-text-alt text-error">
                        {error.message}
                      </label>
                    )}
                  </div>
                )}
              />
              <Controller
                name={`variations.${index}.variationSpec` as const}
                control={control}
                rules={{
                  validate: (value) => !isEmpty(value.trim()) || "種類規格必填",
                }}
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
                    {error && (
                      <label className="justify-end label label-text-alt text-error">
                        {error.message}
                      </label>
                    )}
                  </div>
                )}
              />
              <Controller
                name={`variations.${index}.originalPrice` as const}
                control={control}
                render={({ field }) => (
                  <div className="w-full">
                    <label className="label label-text">商品原價</label>
                    <input
                      {...field}
                      type="number"
                      min={0}
                      className="w-full input input-bordered"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value || "0"))
                      }
                    />
                  </div>
                )}
              />
              <Controller
                name={`variations.${index}.currentPrice` as const}
                control={control}
                render={({ field }) => (
                  <div className="w-full">
                    <label className="label label-text">商品現價</label>
                    <input
                      {...field}
                      type="number"
                      min={0}
                      className="w-full input input-bordered"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value || "0"))
                      }
                    />
                  </div>
                )}
              />

              {/* second column */}
              <Controller
                name={`variations.${index}.stock` as const}
                control={control}
                render={({ field }) => (
                  <div className="w-full">
                    <label className="label label-text">商品存貨</label>
                    <input
                      {...field}
                      type="number"
                      min={0}
                      className="w-full input input-bordered"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value || "0"))
                      }
                    />
                  </div>
                )}
              />
              <Controller
                name={`variations.${index}.bannerImage` as const}
                control={control}
                rules={{ required: "必須上傳圖片" }}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className="col-span-2">
                    <label className="label">
                      <span>
                        <span>首頁縮圖</span>
                        <span className="text-red-700">*</span>
                      </span>
                    </label>
                    <input
                      onChange={(e) =>
                        onChange(e.target.files ? e.target.files[0] : null)
                      }
                      type="file"
                      accept=".webp, .avif"
                      className="w-full file-input file-input-bordered"
                    />
                    {error && (
                      <label className="justify-end label label-text-alt text-error">
                        {error.message}
                      </label>
                    )}
                  </div>
                )}
              />
              <div className="self-end w-full border-[1px] rounded-lg border-opacity-20 bg-base-100 border-black form-control">
                <label className="cursor-pointer label">
                  <span className="text-lg label-text">目前可購買</span>
                  <input
                    type="checkbox"
                    {...register(`variations.${index}.available`)}
                    className="checkbox checkbox-lg"
                  />
                </label>
              </div>
              <div className="divider col-span-full" />
            </li>
          ))}
        </ul>
      </div>

      {/* 相關商品 */}
      <div className="col-span-2 form-control">
        <div className="label">
          <div>相關商品（名稱）</div>
          <button
            type="button"
            onClick={() =>
              appendRelativeProduct(
                {
                  productName: "",
                },
                {
                  shouldFocus: false,
                },
              )
            }
            className="btn btn-ghost btn-sm"
          >
            新增欄位
          </button>
        </div>
        {relativeProductField.map((relativeProduct, index) => (
          <div key={relativeProduct.id} className="flex flex-col gap-1 mt-2">
            <div className="badge badge-primary badge-outline badge-lg">
              第{index + 1}個
            </div>
            <Controller
              name={`relatedProducts.${index}.productName` as const}
              control={control}
              rules={{
                validate: (value) => !isEmpty(value.trim()) || "不可空白",
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <div className="flex items-center">
                    <input
                      {...field}
                      type="text"
                      className="input input-bordered grow"
                    />
                    <button
                      type="button"
                      onClick={() => removeRelativeProduct(index)}
                      className="btn btn-square btn-ghost"
                    >
                      <GiCancel className="w-7 h-7" />
                    </button>
                  </div>
                  {error && (
                    <label className="justify-end label label-text-alt text-error">
                      {error.message}
                    </label>
                  )}
                </>
              )}
            />
          </div>
        ))}
      </div>

      {/* 客製化 */}
      <div className="col-span-2 form-control">
        <div className="label">
          <div>客製化</div>
          <div className="flex items-center">
            <select
              className="w-full select select-bordered shadow"
              value={customizationType}
              onChange={(e) =>
                setCustomizationType(e.target.value as CustomizationType)
              }
            >
              {customizationTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addCustomizationField}
              className="btn btn-ghost btn-sm"
            >
              新增欄位
            </button>
          </div>
        </div>
        {customizationField.map((customization, index) => (
          <div key={customization.id} className="grid grid-cols-2 gap-3 mt-2">
            <div className="flex items-center justify-between col-span-full">
              <span className="badge badge-primary badge-outline badge-lg">
                第{index + 1}個客製化
              </span>
              <button
                onClick={() => removeCustomization(index)}
                className="btn btn-square btn-ghost"
              >
                <GiCancel className="w-7 h-7" />
              </button>
            </div>

            {/* shared property fields */}
            <Controller
              name={`customizations.${index}.name` as const}
              control={control}
              rules={{
                validate: (value) => !isEmpty(value.trim()) || "不可空白",
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="w-full">
                  <label className="label label-text">
                    <span>
                      <span>名稱</span>
                      <span className="text-red-700">*</span>
                    </span>
                  </label>
                  <input
                    {...field}
                    type="text"
                    className="w-full input input-bordered"
                  />
                  {error && (
                    <label className="justify-end label label-text-alt text-error">
                      {error.message}
                    </label>
                  )}
                </div>
              )}
            />

            <div className="self-end w-full border-[1px] rounded-lg border-opacity-20 bg-base-100 border-black form-control">
              <label className="cursor-pointer label">
                <span className="text-lg label-text">是否必需</span>
                <input
                  type="checkbox"
                  {...register(`customizations.${index}.required` as const)}
                  className="checkbox checkbox-lg"
                />
              </label>
            </div>

            <div>
              <label className="label label-text">
                <span>客製化類型</span>
              </label>
              <input
                type="text"
                className="w-full input input-bordered"
                defaultValue={customization.type}
                readOnly={true}
              />
            </div>

            {/* customization specific fields */}
            {customization.type === CustomizationType.SIMPLEFILES && (
              <>
                <Controller
                  name={`customizations.${index}.customization.price` as const}
                  control={control}
                  rules={{
                    validate: (value) => value >= 0 || "價錢必須大於等於0",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="">
                      <label className="label label-text">
                        <span>
                          <span>價錢</span>
                        </span>
                      </label>
                      <input
                        {...field}
                        type="number"
                        className="w-full input input-bordered"
                        min="0"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value || "0", 10))
                        }
                      />
                      {error && (
                        <label className="justify-end label label-text-alt text-error">
                          {error.message}
                        </label>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name={
                    `customizations.${index}.customization.fileRequirePara.minRequiredfilesCount` as const
                  }
                  control={control}
                  rules={{
                    validate: (value) =>
                      value >= 0 || "最少上傳檔案數量必須大於等於0",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="">
                      <label className="label label-text">
                        <span>
                          <span>最少上傳檔案數量</span>
                        </span>
                      </label>
                      <input
                        {...field}
                        type="number"
                        className="w-full input input-bordered"
                        min="0"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value || "0", 10))
                        }
                      />
                      {error && (
                        <label className="justify-end label label-text-alt text-error">
                          {error.message}
                        </label>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name={
                    `customizations.${index}.customization.fileRequirePara.maxRequiredfilesCount` as const
                  }
                  control={control}
                  rules={{
                    validate: (value) =>
                      value >= 0 || "最多上傳檔案數量必須大於等於0",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="">
                      <label className="label label-text">
                        <span>
                          <span>最多上傳檔案數量</span>
                        </span>
                      </label>
                      <input
                        {...field}
                        type="number"
                        className="w-full input input-bordered"
                        min="0"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value || "0", 10))
                        }
                      />
                      {error && (
                        <label className="justify-end label label-text-alt text-error">
                          {error.message}
                        </label>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name={
                    `customizations.${index}.customization.fileRequirePara.fileMimeTypes` as const
                  }
                  control={control}
                  rules={{
                    required: "不可空白",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="col-span-full">
                      <div className="label">
                        <span className="label-text">檔案格式</span>
                        <span className="label-text-alt">
                          只可選同一類型(圖片、音訊、影片)
                        </span>
                      </div>
                      <Select
                        isMulti
                        options={mimeTypesOptions}
                        onChange={(selectedOptions) => {
                          field.onChange(
                            selectedOptions.map((option) => option.value),
                          );
                        }}
                      />
                      {error && (
                        <label className="justify-end label label-text-alt text-error">
                          {error.message}
                        </label>
                      )}
                    </div>
                  )}
                />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="divider col-span-full" />

      <button
        className={clsx(
          "col-span-2 col-start-2 btn btn-primary",
          isSubmitting && "btn-disabled",
        )}
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner" />
            處理中
          </>
        ) : (
          "新增商品"
        )}
      </button>
    </form>
  );
}

async function updateImages(
  data: TImageData[],
  productData: TProduct,
  key: keyof TProduct,
) {
  // update file sequentially
  const processArraySequentially = async (arrayData: TImageData[]) => {
    const images: TImage[] = [];
    for (const file of arrayData) {
      const imageResult = await getImageData(file);
      if (imageResult) images.push(imageResult);
    }
    return images;
  };

  const imagesData = await processArraySequentially(data);
  switch (key) {
    case "previewImages":
      productData[key] = imagesData;
      break;
    case "detailImages":
      productData[key] = imagesData;
      break;
  }
}

async function processVariationArraySequentially(
  variationDataArray: VariationData[],
) {
  const variationData: TVariation[] = [];
  for (const variation of variationDataArray) {
    const bannerImage = await getImageData({ image: variation.bannerImage });
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
