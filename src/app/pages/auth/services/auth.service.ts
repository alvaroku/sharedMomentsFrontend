import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserResponse } from '../models/user-response.model';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { LOCAL_STORAGE_CONSTANTS } from '../../../shared/constants/local-storage.constants';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResultPattern } from '../../../shared/models/result-pattern.model';
import { LoginResponse } from '../models/login-response.model';
import { LoginRequest } from '../models/login-request.model';
import { UserRequest } from '../models/user-request.model';
import { ChangePasswordRequest } from '../../user/models/change-password-request.model';
import { ChangePasswordResponse } from '../../user/models/change-password-response.model';
import { RecoveryPasswordRequest } from '../models/recovery-password-request.model';
import { RecoveryPasswordResponse } from '../models/recovery-password-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl:string = environment.api

  private currentUserState = new BehaviorSubject<LoginResponse |null>(null);

  constructor(private localstorage:LocalStorageService,private http:HttpClient){
    this.setCurrentUserState = localstorage.getItem<LoginResponse>(LOCAL_STORAGE_CONSTANTS.USER_KEY);
  }
  get getCurrentUserState() {
    return this.currentUserState.asObservable();
  }
  set setCurrentUserState(value:LoginResponse |null) {
    this.currentUserState.next(value);
  }
  login(request:LoginRequest):Observable<ResultPattern<LoginResponse>> {
    return this.http.post<ResultPattern<LoginResponse>>(`${this.baseUrl}user/login`, request);
  }
  register(request:UserRequest):Observable<ResultPattern<LoginResponse>> {
    return this.http.post<ResultPattern<UserResponse>>(`${this.baseUrl}user/register`, request);
  }
  logout() {
    this.localstorage.removeItem(LOCAL_STORAGE_CONSTANTS.USER_KEY);
    this.currentUserState.next(null);
  }
  changePassword(request:ChangePasswordRequest):Observable<ResultPattern<ChangePasswordResponse>> {
    return this.http.put<ResultPattern<ChangePasswordResponse>>(`${this.baseUrl}user/changePassword`, request);
  }
  recoveryPassword(request:RecoveryPasswordRequest):Observable<ResultPattern<RecoveryPasswordResponse>> {
    this.logout();
    return this.http.post<ResultPattern<RecoveryPasswordResponse>>(`${this.baseUrl}user/recoveryPassword`, request);
  }
}
