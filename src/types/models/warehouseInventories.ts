import {
  Product,
  ProductCategory,
  ProductDetail,
  ProductSummary,
} from "./products";
import { Warehouse } from "./warehouses";

export interface WarehouseInventory {
  id: number;
  productId: number;
  warehouseId: number;
  stock: number;
  warehouseInventoryStatusId: number;
}

export interface WarehouseInventoryStatus {
  id: number;
  name: string;
}

export interface WarehouseInventoryParams {
  limit: number;
  page: number;
  warehouseId?: number;
  searchQuery?: string;
}

// use to display in pagination
export interface WarehouseInventoryPagination {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productCategoryId: number;
  productCategoryName: string;
  productThumbnail?: string;
  quantity: number;
}
