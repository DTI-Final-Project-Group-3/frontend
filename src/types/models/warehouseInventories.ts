import { ProductDetail, ProductSummary } from "./products";
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
  longitude?: number;
  latitude?: number;
  category?: number;
  search?: string;
}

export interface WarehouseInventorySummary {
  id: number;
  product: ProductSummary;
  quantity: number;
  status: WarehouseInventoryStatus;
  warehouse: Warehouse;
}

export interface WarehouseInventoryDetail {
  id: number;
  product: ProductDetail;
  quantity: number;
  status: WarehouseInventoryStatus;
  warehouse: Warehouse;
}
