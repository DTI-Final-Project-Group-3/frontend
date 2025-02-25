export interface ProductMuationQuantity {
  productId: number;
  quantity: number;
  notes?: string;
  requesterId: number;
  destinationWarehouseId: number;
}
