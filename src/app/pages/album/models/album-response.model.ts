import { AlbumUserResponse } from "./album-user-response.model";

export interface AlbumResponse{
  id:string;
  name:string;
  description:string;
  ownerId:string;
  ownerName:string;
  profileUrl?:string;
  sharedWith:AlbumUserResponse  [];
}
