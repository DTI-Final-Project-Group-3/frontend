export interface PaginationResponse<T> {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  content: T[];
  hasPrev: boolean;
  hasNext: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
