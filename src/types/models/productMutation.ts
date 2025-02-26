export interface ProductMutationQuantity {
  productId: number;
  quantity: number;
  notes?: string;
  requesterId: number;
  destinationWarehouseId: number;
}

export interface ProductMutationManual {
  productId: number;
  quantity: number;
  notes?: string;
  requesterId: number;
  originWarehouseId: number;
  destinationWarehouseId: number;
}
