import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DefaultFilter } from '../../../shared/models/default-filter.model';
import { Observable } from 'rxjs';
import { ResultPattern } from '../../../shared/models/result-pattern.model';
import { PaginateResponse } from '../../../shared/models/paginate-response.model';
import { AlbumResponse } from '../models/album-response.model';
import { AlbumRequest } from '../models/album-request.model';
import { ShareAlbumRequest } from '../models/share-album-request.model';
import { ShareAlbumResponse } from '../models/share-album-response.model';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  baseUrl:string = environment.api

  constructor(private http:HttpClient){
  }

  getAll(request:DefaultFilter):Observable<ResultPattern<PaginateResponse<AlbumResponse>>> {
    let params = new HttpParams();

    // Convertir las propiedades del objeto request a parámetros de URL
    Object.keys(request).forEach(key => {
      const value = request[key as keyof DefaultFilter];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<ResultPattern<PaginateResponse<AlbumResponse>>>(`${this.baseUrl}album`,{params});
  }
  getSharedWithMe(request:DefaultFilter):Observable<ResultPattern<PaginateResponse<AlbumResponse>>> {
    let params = new HttpParams();

    // Convertir las propiedades del objeto request a parámetros de URL
    Object.keys(request).forEach(key => {
      const value = request[key as keyof DefaultFilter];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<ResultPattern<PaginateResponse<AlbumResponse>>>(`${this.baseUrl}album/GetSharedWithMe`,{params});
  }

  create(data:AlbumRequest):Observable<ResultPattern<AlbumResponse>> {
    return this.http.post<ResultPattern<AlbumResponse>>(`${this.baseUrl}album`, data);
  }
  update(id:string,data:AlbumRequest):Observable<ResultPattern<AlbumResponse>> {
    return this.http.put<ResultPattern<AlbumResponse>>(`${this.baseUrl}album/${id}`, data);
  }
  getById(id:string):Observable<ResultPattern<AlbumResponse>> {

    return this.http.get<ResultPattern<AlbumResponse>>(`${this.baseUrl}album/${id}`);
  }

  delete(id:string):Observable<ResultPattern<boolean>> {

    return this.http.delete<ResultPattern<boolean>>(`${this.baseUrl}album/${id}`);
  }
  share(id:string,payload:ShareAlbumRequest):Observable<ResultPattern<ShareAlbumResponse[]>> {
    return this.http.post<ResultPattern<ShareAlbumResponse[]>>(`${this.baseUrl}album/${id}/share`,payload);
  }

  deleteShare(userId:string,momentId:string):Observable<ResultPattern<boolean>> {
    return this.http.delete<ResultPattern<boolean>>(`${this.baseUrl}album/${momentId}/deleteShare/${userId}`);
  }
}
