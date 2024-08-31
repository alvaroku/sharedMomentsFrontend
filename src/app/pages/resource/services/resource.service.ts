import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultPattern } from '../../../shared/models/result-pattern.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  baseUrl:string = environment.api

  constructor(private http:HttpClient){
  }

  delete(id:string):Observable<ResultPattern<boolean>> {
    return this.http.delete<ResultPattern<boolean>>(`${this.baseUrl}resource/${id}`);
  }
}
