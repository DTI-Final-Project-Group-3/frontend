export interface Product {
  id: number;
  name: string;
  price: number;
}

//use to display in pagination
export interface ProductSummary extends Product {
  thumbnail?: ProductImage;
  category: ProductCategory;
}

// use to display in product detail page
export interface ProductDetail extends Product {
  description?: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  images?: ProductImage[];
  category: ProductCategory;
}

export interface ProductImage {
  url: string;
  position: number;
}

export interface ProductCategory {
  id: number;
  name: string;
}
