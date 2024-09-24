import { DataDropDownUser } from "./data-drop-down-user.model";

export interface UserFriendRequest extends DataDropDownUser{
  status?: EFriendRequestStatus;
  ownerId?: string;
}
export enum EFriendRequestStatus {
  sent,
  accepted,
}
