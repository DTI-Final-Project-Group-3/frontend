export interface PaginationResponse<T> {
  currentPage: number;
  totalPages: number;
  content: T[];
  hasPrev: boolean;
  hasNext: boolean;
}
