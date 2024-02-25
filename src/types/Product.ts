export type TProduct = {
  productId?: string;
  productName: string;
  productDescription?: string;
  originalPrice?: number;
  currentPrice?: number;
  stock?: number;
  available?: boolean;
  sold?: number;
  variations?: TVariation[];
  productUpstreamUrl?: string;
  bannerImage?: TImage;
  previewImages?: TImage[];
  detailImages?: TImage[];
  specification?: string;
  keyWords?: string[];
  customizations: CustomizationItem[];
  relatedProducts?: string[];
};

export type CustomizationItem = {
  name: string;
  type: string;
  customization: object;
  /**
   * default: false
   */
  required?: boolean;
};

export type TVariation = {
  variationName: string;
  variationSpec: string;
  originalPrice?: number;
  currentPrice?: number;
  available?: boolean;
  stock?: number;
  sold?: number;
  bannerImage?: TImage;
};

export type TBanner = {
  productId?: string;
  productName: string;
  productDescription?: string;
  originalPrice?: number;
  currentPrice?: number;
  available?: boolean;
  bannerImage: TImage;
};

export type TImage = {
  imageId?: string;
  blurhash?: string;
  width?: number;
  height?: number;
  description?: string;
};

// use in add product
export type TImageData = {
  description?: string;
  image: File | null;
};
