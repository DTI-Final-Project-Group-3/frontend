import { ProductBasic, ProductCategory } from "@/types/models/products";

export interface ProductMutationRequest {
  productId: number;
  quantity: number;
  requesterNotes?: string;
  requesterId: number;
  originWarehouseId?: number;
  destinationWarehouseId: number;
}

export interface ProductMutationManualResponse {
  productMutationId: number;
  productId: number;
  quantity: number;
  requesterId: number;
  requesterNotes: string;
  reviewerId: number | null;
  reviewerNotes: string;
  originWarehouseId: number;
  destinationWarehouseId: number;
  productMutationTypeId: number;
  productMutationTypeName: string;
  productMutationStatusId: number;
  reviewedAt: string | null;
  invoiceCode: string;
}

export interface ProductMutationParams {
  page: number;
  limit: number;
  originWarehouseId?: number;
  destinationWarehouseId?: number;
  productMutationTypeId: number[];
}

export interface ProductMutationProcessRequest {
  userId: number;
  notes: string | undefined;
}

export interface ProductMutationDetailResponse {
  productMutationId: number;
  productId: number;
  productName: string;
  productThumbnail: string;
  quantity: number;
  requesterId: number;
  requesterName: string;
  requesterNotes: string | null;
  reviewerId: number | null;
  reviewerName: string | null;
  reviewerNotes: string | null;
  originWarehouseId: number | null;
  originWarehouseName: string | null;
  destinationWarehouseId: number | null;
  destinationWarehouseName: string | null;
  productMutationTypeId: number;
  productMutationTypeName: string;
  productMutationStatusId: number;
  productMutationStatusName: string;
  invoiceCode: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export interface ProductMutationHistoryParams {
  page?: number;
  limit?: number;
  startedAt: string;
  endedAt: string;
  productId?: number;
  productCategoryId?: number;
  productMutationTypeId?: number;
  productMutationStatusId?: number;
  destinationWarehouseId?: number;
}

export interface ProductMutationReportDailySummaryResponse {
  date: string;
  added: number;
  reduced: number;
}

export interface ProductMutationReportTotalResponse {
  started: number;
  added: number;
  reduced: number;
  netChange: number;
  ending: number;
}

export interface ProductMutationType {
  id: number;
  name: string;
}
export interface ProductMutationStatus {
  id: number;
  name: string;
}
export interface ProductMutationReportResponse {
  id: number;
  createdAt: string;
  quantity: number;
  product: ProductBasic;
  productCategory: ProductCategory;
  productMutationType: ProductMutationType;
  productMutationStatus: ProductMutationStatus;
}
