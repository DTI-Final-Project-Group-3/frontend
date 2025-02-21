import { Warehouse } from "./warehouses";

export interface Product {
  id: number;
  name: string;
  price: number;
}

//use to display in pagination
export interface ProductSummary extends Product {
  totalStock: number;
  thumbnail?: string;
  categoryName: string;
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
  totalStock: number;
  nearestWarehouse: Warehouse;
}

export interface ProductImage {
  url: string;
  position: number;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface PaginatedProductParams {
  page: number;
  limit: number;
  longitude?: number;
  latitude?: number;
  radius?: number;
  productCategoryId?: number;
  searchQuery?: string;
}
