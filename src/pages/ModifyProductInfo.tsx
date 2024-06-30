import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { GiCancel } from "react-icons/gi";
import clsx from "clsx";
import { showToast } from "@/utils/toastAlert";
import type { TProduct, TImage, TImageData, TVariation } from "@/types/Product";
import { getImageData } from "@/utils/processFile";
import { isEmpty, map, uniq } from "lodash";
import {
  CustomizationDetail,
  CustomizationType,
} from "@/types/Customization/CustomizationBase";
import { useState } from "react";
import Select from "react-select";
import mimeTypes from "@/data/mimeTypes.json";
import getProductByName from "@/actions/getProductByName";
import modifyProduct from "@/actions/modifyProduct";
import { useNavigate } from "react-router-dom";

type VariationData = {
  variationName: string;
  variationSpec: string;
  originalPrice?: number;
  currentPrice?: number;
  available?: boolean;
  stock?: number;
  bannerImage: File | null;
};

type DefaultVariationData = {
  variationName: string;
  variationSpec: string;
  originalPrice?: number;
  currentPrice?: number;
  available?: boolean;
  stock?: number;
  bannerImage: TImage;
  bannerIMG?: File | null;
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
  variations: VariationData[];
  customizations?: CustomizationDetail[];
  relatedProducts?: {
    productName: string;
  }[];
  defaultVariations: DefaultVariationData[];
  defaultCustomizations?: CustomizationDetail[];
  defaultPreviewImages?: TImage[];
  detailImages: TImageData[];
  defaultDetailImages?: TImage[];
};

export default function ModifyProductInfo({
  data,
  tokenCookie,
}: {
  data: TProduct;
  tokenCookie: string;
}) {
  const url =
    "https://storage.googleapis.com/dev_turtle_static/backend/product/" +
    data.productId +
    "/";

  const mainPage = url + data.bannerImage?.imageId;
  const navigate = useNavigate();

  const variationDefaultValue = {
    variationName: "",
    variationSpec: "",
    originalPrice: 0,
    currentPrice: 0,
    available: true,
    stock: 0,
    bannerImage: null,
  };

  const defaultVariationsData: DefaultVariationData[] = [];

  data.variations?.map((variation) => {
    const data = {
      variationName: variation.variationName,
      variationSpec: variation.variationSpec,
      originalPrice: variation.originalPrice!,
      currentPrice: variation.currentPrice!,
      available: variation.available!,
      stock: variation.stock!,
      bannerImage: variation.bannerImage!,
      bannerIMG: null,
    };
    defaultVariationsData.push(data);
  });

  const formDefaultValue: FormInputs = {
    productName: data.productName,
    originalPrice: data.originalPrice,
    currentPrice: data.currentPrice,
    stock: data.stock,
    available: data.available,
    detailImages: [{ description: "", image: null }],
    variations: [variationDefaultValue],
    defaultPreviewImages: data.previewImages,
    defaultDetailImages: data.detailImages,
    defaultVariations: defaultVariationsData,
    defaultCustomizations: data.customizations,
  };

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

  const defaultPreviewImgs = data.previewImages;

  const { fields: defaultDetailImages, remove: removedefaultDetailImages } =
    useFieldArray({
      control,
      name: "defaultDetailImages",
    });

  const {
    fields: detailField,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({
    control,
    name: "detailImages",
  });

  const { fields: defaultVariations, remove: removedefaultVariations } =
    useFieldArray({
      control,
      name: "defaultVariations",
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

  data.relatedProducts?.map((name) => {
    appendRelativeProduct({ productName: name });
  });

  const {
    fields: customizationField,
    append: appendCustomization,
    remove: removeCustomization,
  } = useFieldArray({
    control,
    name: "customizations",
  });

  const {
    fields: defaultcustomizationField,
    remove: removeDefaultCustomization,
  } = useFieldArray({
    control,
    name: "defaultCustomizations",
  });

  const defaultCustomizationtype: { label: string; value: string }[][] = [];

  defaultcustomizationField.map((Customization) => {
    const defaultType: { label: string; value: string }[] = [];
    Customization.customization.fileRequirePara.fileMimeTypes.map((type) => {
      switch (type) {
        case "image/avif":
          defaultType.push({
            value: "image/avif",
            label: ".avif",
          });
          break;
        case "image/jpeg":
          defaultType.push({
            value: "image/jpeg",
            label: ".jpg",
          });
          break;
        case "image/png":
          defaultType.push({
            value: "image/png",
            label: ".png",
          });
          break;
        case "image/svg+xml":
          defaultType.push({
            value: "image/svg+xml",
            label: ".svg",
          });
          break;
        case "image/webp":
          defaultType.push({
            value: "image/webp",
            label: ".webp",
          });
          break;
        case "audio/mpeg":
          defaultType.push({
            value: "audio/mpeg",
            label: ".mp3",
          });
          break;
        case "audio/aac":
          defaultType.push({
            value: "audio/aac",
            label: ".aac",
          });
          break;
        case "video/mp4":
          defaultType.push({
            value: "video/mp4",
            label: ".mp4",
          });
          break;
        case "video/x-msvideo":
          defaultType.push({
            value: "video/x-msvideo",
            label: ".avi",
          });
          break;
      }
    });
    defaultCustomizationtype.push(defaultType);
  });

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
      if (formData.defaultCustomizations) {
        formData.defaultCustomizations.forEach((customizationItem) => {
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

      const customizationResult = formData.defaultCustomizations?.concat(
        formData.customizations!,
      );

      const productData: TProduct = {
        productId: data.productId,
        productName: formData.productName,
        productDescription: formData.productDescription,
        originalPrice: formData.originalPrice,
        currentPrice: formData.currentPrice,
        stock: formData.stock,
        available: formData.available,
        productUpstreamUrl: formData.productUpstreamUrl,
        relatedProducts: relatedProductIds,
        customizations: customizationResult ?? [],
        merchantId: data.merchantId,
      };

      // process bannerImage

      if (formData.bannerImage?.length === 0) {
        productData.bannerImage = data.bannerImage;
      } else {
        const updateBannerImage = await getImageData({
          image: formData.bannerImage![0],
        });
        productData.bannerImage = updateBannerImage;
      }

      // process previewImage
      if (formData.defaultPreviewImages !== null) {
        productData.previewImages = formData.defaultPreviewImages;
      }
      if (
        formData.previewImages !== undefined &&
        formData.previewImages.length > 0
      ) {
        const files = formData.previewImages.filter(
          (item) => item.image !== null,
        );
        await updateImages(
          files,
          formData.defaultPreviewImages!,
          productData,
          "previewImages",
        );
      }

      // process detailImage
      if (formData.defaultDetailImages !== null) {
        productData.detailImages = formData.defaultDetailImages;
      }
      const detailImagesData = formData.detailImages.filter(
        (item) => !(item.description === "" && item.image === null),
      );
      await updateImages(
        detailImagesData,
        formData.defaultDetailImages!,
        productData,
        "detailImages",
      );

      // process variation
      const variationDataArray = await processVariationArraySequentially(
        formData.variations,
        formData.defaultVariations,
      );
      productData.variations = variationDataArray;

      const modifyProductResult = await sendRequest(productData, tokenCookie);
      showToast(
        "success",
        `商品「${modifyProductResult.productName}」修改成功!`,
      );

      // Success will rest the form, if fail will throw error and don't trigger reset
      reset();
      navigate("/");
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
              image_width: 0,
              image_height: 0,
              audio_length: 0,
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
          defaultValue={data.productName}
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
          defaultValue={data.productUpstreamUrl}
        />
      </div>

      {/* productDescription */}
      <div className="form-control col-span-full">
        <label className="label">商品描述</label>
        <textarea
          {...register("productDescription")}
          className="h-24 resize-none textarea textarea-bordered"
          defaultValue={data.productDescription}
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

      {/* bannerImage */}
      <div className="col-span-2 form-control">
        <label className="label">
          <span>
            <span>首頁縮圖</span>
          </span>
        </label>
        <label>
          <span>現在縮圖</span>
          <span>
            <img src={mainPage} />
          </span>
        </label>
        <span>欲修改縮圖</span>
        <input
          type="file"
          accept=".webp, .avif"
          {...register("bannerImage")}
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
            defaultChecked={data.available}
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
          {defaultPreviewImgs!.map((item, index) => (
            <li key={item.imageId} className="flex flex-col gap-1 mt-2">
              <div className="badge badge-primary badge-outline badge-lg">
                第{index + 1}個預覽圖
              </div>
              <div>
                <img src={url + item.imageId} />
              </div>
              <button
                className="btn bg-[#263238] text-white"
                onClick={() => {
                  const index = defaultPreviewImgs!.indexOf(item);
                  if (index > -1) {
                    defaultPreviewImgs!.splice(index, 1);
                  }
                }}
              >
                刪除
              </button>
            </li>
          ))}

          {previewField.map((item, index) => (
            <li key={item.id} className="flex flex-col gap-1 mt-2">
              <div className="badge badge-primary badge-outline badge-lg">
                第{defaultPreviewImgs!.length + index + 1}個預覽圖
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
          {defaultDetailImages.map((item, index) => (
            <li key={item.id} className="flex flex-col gap-1 mt-2">
              <div className="flex items-center justify-between">
                <div className="badge badge-primary badge-outline badge-lg">
                  第{index + 1}個詳細圖文欄位
                </div>
                {
                  <button
                    onClick={() => removedefaultDetailImages(index)}
                    className="btn btn-square btn-ghost"
                  >
                    <GiCancel className="w-7 h-7" />
                  </button>
                }
              </div>
              <div>
                <img src={url + item.imageId} />
              </div>
              <Controller
                name={`defaultDetailImages.${index}.description` as const}
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
          {detailField.map((item, index) => (
            <li key={item.id} className="flex flex-col gap-1 mt-2">
              <div className="flex items-center justify-between">
                <div className="badge badge-primary badge-outline badge-lg">
                  第{defaultDetailImages.length + index + 1}個詳細圖文欄位
                </div>
                {defaultDetailImages.length + index > 0 && (
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
                    if (defaultDetailImages.length + index === 0) {
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
              appendVariation(variationDefaultValue, {
                shouldFocus: false,
              })
            }
            type="button"
            className="btn btn-ghost btn-sm"
          >
            新增規格欄位
          </button>
        </div>
        <ul>
          {defaultVariations.map((item, index) => (
            <li key={item.id} className="grid grid-cols-4 gap-3">
              <div className="grid grid-cols-4 items-center justify-between col-span-full text-center m-1">
                <div className="badge badge-primary badge-outline badge-lg ">
                  第{index + 1}個規格欄位
                </div>
                <div>現在縮圖</div>
                <div>
                  <img src={url + item.bannerImage?.imageId} />
                </div>
                {
                  <div>
                    <button
                      onClick={() => removedefaultVariations(index)}
                      className="btn btn-square btn-ghost m-0"
                    >
                      <GiCancel className="w-7 h-7" />
                    </button>
                  </div>
                }
              </div>

              {/* first column */}
              <Controller
                name={`defaultVariations.${index}.variationName` as const}
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
                name={`defaultVariations.${index}.variationSpec` as const}
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
                name={`defaultVariations.${index}.originalPrice` as const}
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
                name={`defaultVariations.${index}.currentPrice` as const}
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
                name={`defaultVariations.${index}.stock` as const}
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
                name={`defaultVariations.${index}.bannerIMG` as const}
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className="col-span-2">
                    <label className="label">
                      <span>
                        <span>首頁縮圖</span>
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
                    {...register(`defaultVariations.${index}.available`)}
                    className="checkbox checkbox-lg"
                  />
                </label>
              </div>
              <div className="divider col-span-full" />
            </li>
          ))}
          {variationField.map((item, index) => (
            <li key={item.id} className="grid grid-cols-4 gap-3">
              <div className="flex items-center justify-between col-span-full">
                <span className="badge badge-primary badge-outline badge-lg">
                  第{defaultVariations.length + index + 1}個規格欄位
                </span>
                {index + defaultVariationsData.length > 0 && (
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
        {defaultcustomizationField.map((customization, index) => (
          <div key={customization.id} className="grid grid-cols-2 gap-3 mt-2">
            <div className="flex items-center justify-between col-span-full">
              <span className="badge badge-primary badge-outline badge-lg">
                第{index + 1}個客製化
              </span>
              <button
                onClick={() => removeDefaultCustomization(index)}
                className="btn btn-square btn-ghost"
              >
                <GiCancel className="w-7 h-7" />
              </button>
            </div>

            {/* shared property fields*/}
            <Controller
              name={`defaultCustomizations.${index}.name` as const}
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
                  {...register(
                    `defaultCustomizations.${index}.required` as const,
                  )}
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

            {/* customization specific fields*/}
            {customization.type === CustomizationType.SIMPLEFILES && (
              <>
                <Controller
                  name={
                    `defaultCustomizations.${index}.customization.price` as const
                  }
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
                    `defaultCustomizations.${index}.customization.fileRequirePara.minRequiredfilesCount` as const
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
                    `defaultCustomizations.${index}.customization.fileRequirePara.maxRequiredfilesCount` as const
                  }
                  control={control}
                  rules={{
                    validate: (value) =>
                      value >= 0 || "最多上傳檔案數量必須大於等於0",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
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
                    `defaultCustomizations.${index}.customization.fileRequirePara.fileMimeTypes` as const
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
                        defaultValue={defaultCustomizationtype[index]}
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

                <Controller
                  name={
                    `defaultCustomizations.${index}.customization.fileRequirePara.image_width` as const
                  }
                  control={control}
                  rules={{
                    validate: (value) => value >= 0 || "圖片寬度必須大於等於0",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="">
                      <label className="label label-text">
                        <span>
                          <span>圖片寬度</span>
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
                    `defaultCustomizations.${index}.customization.fileRequirePara.image_height` as const
                  }
                  control={control}
                  rules={{
                    validate: (value) => value >= 0 || "圖片高度必須大於等於0",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="">
                      <label className="label label-text">
                        <span>
                          <span>圖片高度</span>
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
                    `defaultCustomizations.${index}.customization.fileRequirePara.audio_length` as const
                  }
                  control={control}
                  rules={{
                    validate: (value) => value >= 0 || "音訊長度必須大於等於0",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="">
                      <label className="label label-text">
                        <span>
                          <span>音訊長度(秒)</span>
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
              </>
            )}
          </div>
        ))}
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

            {/* shared property fields*/}
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

            {/* customization specific fields*/}
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
                    <div>
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

                <Controller
                  name={
                    `customizations.${index}.customization.fileRequirePara.image_width` as const
                  }
                  control={control}
                  rules={{
                    validate: (value) => value >= 0 || "圖片寬度必須大於等於0",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="">
                      <label className="label label-text">
                        <span>
                          <span>圖片寬度</span>
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
                    `customizations.${index}.customization.fileRequirePara.image_height` as const
                  }
                  control={control}
                  rules={{
                    validate: (value) => value >= 0 || "圖片高度必須大於等於0",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="">
                      <label className="label label-text">
                        <span>
                          <span>圖片高度</span>
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
                    `customizations.${index}.customization.fileRequirePara.audio_length` as const
                  }
                  control={control}
                  rules={{
                    validate: (value) => value >= 0 || "音訊長度必須大於等於0",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="">
                      <label className="label label-text">
                        <span>
                          <span>音訊長度(秒)</span>
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
          "修改商品"
        )}
      </button>
    </form>
  );
}

async function updateImages(
  data: TImageData[],
  previewData: TImage[],
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
      productData[key] = previewData.concat(imagesData);
      break;
    case "detailImages":
      productData[key] = previewData.concat(imagesData);
      break;
  }
}

async function processVariationArraySequentially(
  variationDataArray: VariationData[],
  defaultVariations: DefaultVariationData[],
) {
  const variationData: TVariation[] = [];
  for (const data of defaultVariations) {
    if (data.bannerIMG !== null) {
      const bannerImage = await getImageData({ image: data.bannerIMG! });
      const result: TVariation = {
        variationName: data.variationName,
        variationSpec: data.variationSpec,
        originalPrice: data.originalPrice,
        currentPrice: data.currentPrice,
        available: data.available,
        stock: data.stock,
        bannerImage: bannerImage,
      };
      variationData.push(result);
    } else {
      const result: TVariation = {
        variationName: data.variationName,
        variationSpec: data.variationSpec,
        originalPrice: data.originalPrice,
        currentPrice: data.currentPrice,
        available: data.available,
        stock: data.stock,
        bannerImage: data.bannerImage,
      };
      variationData.push(result);
    }
  }

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

function sendRequest(data: TProduct, token: string | undefined) {
  const json = modifyProduct(token!, data);
  return json;
}
