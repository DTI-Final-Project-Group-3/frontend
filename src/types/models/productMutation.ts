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

export interface ProductMutationParams {
  page: number;
  limit: number;
  originWarehouseId?: number;
  destinationWarehouseId?: number;
  mutationTypeId: number;
}

export interface ProductMutationDetailResponse {
  productMutationId: number;
  productId: number;
  productName: string;
  productThumbnail: string;
  quantity: number;
  notes: string | null;
  requesterId: number;
  requesterName: string;
  approverId: number | null;
  approverName: string | null;
  originWarehouseId: number | null;
  originWarehouseName: string | null;
  destinationWarehouseId: number;
  destinationWarehouseName: string;
  productMutationTypeId: number;
  productMutationTypeName: string;
  productMutationStatusId: number;
  productMutationStatusName: string;
  createdAt: string;
  acceptedAt: string | null;
}
