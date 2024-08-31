import { PaginateParams } from "./paginate-params.model";

export interface DefaultFilter extends PaginateParams {
  search?: string;
  status?:boolean;
}
