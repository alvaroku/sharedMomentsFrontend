import { DefaultFilter } from "./default-filter.model";

export interface FilterOwnerParams extends DefaultFilter {
  ownerId?: string;
}
