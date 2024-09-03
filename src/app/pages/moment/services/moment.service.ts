import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DefaultFilter } from '../../../shared/models/default-filter.model';
import { Observable } from 'rxjs';
import { ResultPattern } from '../../../shared/models/result-pattern.model';
import { PaginateResponse } from '../../../shared/models/paginate-response.model';
import { MomentResponse } from '../models/moment-response.model';
import { MomentRequest } from '../models/moment-request.model';
import { ShareMomentRequest } from '../models/share-moment-request.model';
import { ShareMomentResponse } from '../models/share-moment-response.model';

@Injectable({
  providedIn: 'root'
})
export class MomentService {
  baseUrl:string = environment.api

  constructor(private http:HttpClient){
  }

  getAll(request:DefaultFilter):Observable<ResultPattern<PaginateResponse<MomentResponse>>> {
    let params = new HttpParams();

    // Convertir las propiedades del objeto request a parámetros de URL
    Object.keys(request).forEach(key => {
      const value = request[key as keyof DefaultFilter];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<ResultPattern<PaginateResponse<MomentResponse>>>(`${this.baseUrl}moment`,{params});
  }
  getSharedWithMe(request:DefaultFilter):Observable<ResultPattern<PaginateResponse<MomentResponse>>> {
    let params = new HttpParams();

    // Convertir las propiedades del objeto request a parámetros de URL
    Object.keys(request).forEach(key => {
      const value = request[key as keyof DefaultFilter];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<ResultPattern<PaginateResponse<MomentResponse>>>(`${this.baseUrl}moment/GetSharedWithMe`,{params});
  }
  create(data:MomentRequest,fileList:File[]):Observable<ResultPattern<MomentResponse>> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('date', this.appendFormattedDate(data.date));
    formData.append('place', data.place);

    fileList.forEach(file => {
      formData.append('resources', file);
    });
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<ResultPattern<MomentResponse>>(`${this.baseUrl}moment`, formData,{headers});
  }
  update(id:string,data:MomentRequest,fileList:File[]):Observable<ResultPattern<MomentResponse>> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('date', this.appendFormattedDate(data.date));
    formData.append('place', data.place);

    fileList.forEach(file => {
      formData.append('resources', file);
    });
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    return this.http.put<ResultPattern<MomentResponse>>(`${this.baseUrl}moment/${id}`, formData,{headers});
  }
  getById(id:string):Observable<ResultPattern<MomentResponse>> {

    return this.http.get<ResultPattern<MomentResponse>>(`${this.baseUrl}moment/${id}`);
  }

  delete(id:string):Observable<ResultPattern<boolean>> {

    return this.http.delete<ResultPattern<boolean>>(`${this.baseUrl}moment/${id}`);
  }
  share(id:string,payload:ShareMomentRequest):Observable<ResultPattern<ShareMomentResponse[]>> {
    return this.http.post<ResultPattern<ShareMomentResponse[]>>(`${this.baseUrl}moment/${id}/share`,payload);
  }
  appendFormattedDate(date: Date): string {
    // Extraer el día, mes y año de la fecha
    const day = date.getDate().toString().padStart(2, '0'); // Asegurarse de que el día tenga dos dígitos
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son 0-indexados, por lo que se suma 1
    const year = date.getFullYear().toString();

    // Formatear la fecha en el formato 'dd/MM/yyyy'
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
}
