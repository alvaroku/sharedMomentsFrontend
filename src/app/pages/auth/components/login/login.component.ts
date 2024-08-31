import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoginRequest } from '../../models/login-request.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { LoginResponse } from '../../models/login-response.model';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { LOCAL_STORAGE_CONSTANTS } from '../../../../shared/constants/local-storage.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private authService: AuthService,private ls:LocalStorageService,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit() {

    this.authService.getCurrentUserState.subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/home']);
      }else{

      }
    });
  }
 async  onSubmit() {
    if (this.loginForm.valid) {
      try {
        const loginRequest: LoginRequest = this.loginForm.value;
      let response:ResultPattern<LoginResponse> = await firstValueFrom(this.authService.login(loginRequest))
      this.ls.setItem(LOCAL_STORAGE_CONSTANTS.USER_KEY,response.data);
      this.authService.setCurrentUserState = response.data;
      this.router.navigate(['/home']);
      } catch (error) {

      }
    }
  }

}
