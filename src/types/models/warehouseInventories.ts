export interface WarehouseInventory {
  id: number;
  productId: number;
  productName: string;
  warehouseId: number;
  warehouseName: string;
  warehouseInventoryStatusId: number;
  warehouseInventoryStatusName: string;
}

export interface PaginatedWarehouseInventoryRequest {
  limit: number;
  page: number;
  longitude?: number;
  latitude?: number;
  category?: number;
  search?: string;
}

export interface PaginatedWarehouseInventoryResponse {
  warehouseInventoryId: number;
  productId: number;
  productName: string;
  price: number;
  imageUrl?: string;
  stock: number;
  statusId: number;
  statusName: string;
  productCategoryId: number;
  productCategoryName: string;
  warehouseId: number;
  warehouseName: string;
}
