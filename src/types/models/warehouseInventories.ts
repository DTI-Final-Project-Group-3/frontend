export interface WarehouseInventory {
  id: number;
  productId: number;
  warehouseId: number;
  totalQuantity: number;
  warehouseInventoryStatusId?: number;
}

export interface WarehouseInventoryStatus {
  id: number;
  name: string;
}

export interface WarehouseInventoryParams {
  limit: number;
  page: number;
  warehouseId?: number;
  productCategoryId?: number;
  searchQuery?: string;
}

// use to display in pagination admin
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

export interface WarehouseInventoryCreateRequest {
  productId: number;
  warehouseId: number;
  quantity: number;
}
