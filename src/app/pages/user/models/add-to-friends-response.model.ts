import { EFriendRequestStatus } from "./user-friend-request.model";

export interface AddToFriendsResponse {
userId: string;
friendId: string;
status:EFriendRequestStatus
}
