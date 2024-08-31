export interface PaginateResponse<T> {
  list: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
