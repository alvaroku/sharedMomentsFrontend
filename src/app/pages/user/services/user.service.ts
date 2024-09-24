import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataDropDown } from '../../../shared/models/data-dropdown.model';
import { Observable } from 'rxjs';
import { ResultPattern } from '../../../shared/models/result-pattern.model';
import { DefaultFilter } from '../../../shared/models/default-filter.model';
import { DataDropDownUser } from '../models/data-drop-down-user.model';
import { AddToFriendsRequest } from '../models/add-to-friends-request.model';
import { AddToFriendsResponse } from '../models/add-to-friends-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl:string = environment.api

  constructor(private http:HttpClient){
  }

  DataDropDownFriends(request?:DefaultFilter):Observable<ResultPattern<DataDropDownUser[]>> {
    let params = new HttpParams();

    // Convertir las propiedades del objeto request a parámetros de URL
   if(request){
    Object.keys(request).forEach(key => {
      const value = request[key as keyof DefaultFilter];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
   }
    return this.http.get<ResultPattern<DataDropDownUser[]>>(`${this.baseUrl}user/DataDropDownFriends`, {params});
  }
  DataDropDownNoFriends(request?:DefaultFilter):Observable<ResultPattern<DataDropDownUser[]>> {
    let params = new HttpParams();

    // Convertir las propiedades del objeto request a parámetros de URL
   if(request){
    Object.keys(request).forEach(key => {
      const value = request[key as keyof DefaultFilter];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
   }
    return this.http.get<ResultPattern<DataDropDownUser[]>>(`${this.baseUrl}user/DataDropDownNoFriends`, {params});
  }
  addToFriends(request:AddToFriendsRequest):Observable<ResultPattern<AddToFriendsResponse>> {
    return this.http.post<ResultPattern<AddToFriendsResponse>>(`${this.baseUrl}user/addToFriends`, request);
  }
  deleteToFriends(request:AddToFriendsRequest):Observable<ResultPattern<AddToFriendsResponse>> {
    return this.http.delete<ResultPattern<AddToFriendsResponse>>(`${this.baseUrl}user/deleteToFriends/${request.friendId}`);
  }
}
