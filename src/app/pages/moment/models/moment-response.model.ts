import { MomentUserResponse } from "./moment-user-response.model";
import { ResourceResponse } from "./resource-response.model";

export interface MomentResponse {
  id: string;
  title: string;
  description: string;
  date: Date;
  place: string;
  ownerId: string;
  ownerName: string;
  albumId?: string;
  album?: string;
  resources: ResourceResponse[];
  sharedWith: MomentUserResponse[];
}
