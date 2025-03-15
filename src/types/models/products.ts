import { PaginationParams } from "../api/pagination";
import { LocationParams } from "../location";
import { Warehouse } from "./warehouses";

export interface ProductBasic {
  id: number;
  name: string;
}

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
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  nearestWarehouseName: string;
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

export interface ProductParams {
  productId?: number;
  productCategoryId?: number;
  searchQuery?: string;
}

export interface PaginatedProductParams
  extends PaginationParams,
    LocationParams,
    ProductParams {}

export interface ProductForm {
  name: string;
  price: number;
  description: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  images?: ProductImage[];
  productCategoryId: number;
}

export interface PaginatedProductCategoryParams extends PaginationParams {
  accessToken?: string;
}
