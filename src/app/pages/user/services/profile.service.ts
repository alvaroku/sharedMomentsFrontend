import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResultPattern } from '../../../shared/models/result-pattern.model';
import { Observable } from 'rxjs';
import { ProfileResponse } from '../../user/models/profile-response.model';
import { ProfileRequest } from '../models/profile-request.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  baseUrl:string = environment.api

  constructor(private http:HttpClient){
  }

  getProfile():Observable<ResultPattern<ProfileResponse>> {
    return this.http.get<ResultPattern<ProfileResponse>>(`${this.baseUrl}user/profile`);
  }
  updateProfile(data:ProfileRequest):Observable<ResultPattern<ProfileResponse>> {
    const headers = new HttpHeaders();

    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('dateOfBirth', data.dateOfBirth.toISOString());
    if (data.profile) {
      formData.append('profile', data.profile);
    }
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.put<ResultPattern<ProfileResponse>>(`${this.baseUrl}user/profile`,formData,{headers});
  }
}
