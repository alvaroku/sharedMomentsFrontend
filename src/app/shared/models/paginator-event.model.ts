export interface PaginatorEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
  //esto es adicional ya que no lo devuelve el evento onPageChange
  totalRecords: number;
}
