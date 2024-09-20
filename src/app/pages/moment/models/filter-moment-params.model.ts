import { DefaultFilter } from "../../../shared/models/default-filter.model";
import { FilterOwnerParams } from "../../../shared/models/filter-owner-params.model";

export interface FilterMomentParams extends FilterOwnerParams{
  albumId?: string;
  hasAlbum?: boolean;
}
