export type TBanner = {
  productId?: string,
  productName: string,
  productDescription?: string,
  originalPrice?: number,
  currentPrice?: number,
  available?: boolean,
  bannerImage: TImage,
}

export type TImage = {
  imageId?: string,
  blurhash?: string,
  width?: number,
  height?: number
  description?: string
}