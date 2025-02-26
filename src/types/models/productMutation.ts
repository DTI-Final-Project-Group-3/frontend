export interface ProductMutationRequest {
  productId: number;
  quantity: number;
  notes?: string;
  requesterId: number;
  originWarehouseId?: number;
  destinationWarehouseId: number;
}

export interface ProductMutationManualResponse {
  productMutationId: number;
  productId: number;
  quantity: number;
  notes: string;
  requesterId: number;
  approverId: number | null;
  originWarehouseId: number;
  destinationWarehouseId: number;
  productMutationTypeId: number;
  productMutationTypeName: string;
  productMutationStatusId: number;
  acceptedAt: string | null;
}
