import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataDropDown } from '../../../shared/models/data-dropdown.model';
import { Observable } from 'rxjs';
import { ResultPattern } from '../../../shared/models/result-pattern.model';
import { DefaultFilter } from '../../../shared/models/default-filter.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl:string = environment.api

  constructor(private http:HttpClient){
  }

  DataDropDownForShareMoment(request?:DefaultFilter):Observable<ResultPattern<DataDropDown[]>> {
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
    return this.http.get<ResultPattern<DataDropDown[]>>(`${this.baseUrl}user/DataDropDownForShareMoment`, {params});
  }
}
