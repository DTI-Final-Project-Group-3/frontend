export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface ProductSummary extends Product {
  thumbnail: ProductImage;
  category: ProductCategory;
}

export interface ProductDetail extends Product {
  description: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  images: ProductImage[];
  category: ProductCategory;
}

export interface ProductImage {
  url: string;
  position: number;
  alt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}
