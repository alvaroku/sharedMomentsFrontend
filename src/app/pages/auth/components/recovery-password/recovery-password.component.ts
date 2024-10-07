import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { RecoveryPasswordRequest } from '../../models/recovery-password-request.model';
import { RecoveryPasswordResponse } from '../../models/recovery-password-response.model';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    LoadingComponent
  ],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.css'
})
export class RecoveryPasswordComponent {
  isLoading: boolean = false;
  loginForm: FormGroup;

  constructor(private messageService: MessageService,private fb: FormBuilder,private authService: AuthService,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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
      this.isLoading = true;
        const loginRequest: RecoveryPasswordRequest = this.loginForm.value;
      let response:ResultPattern<RecoveryPasswordResponse> = await firstValueFrom(this.authService.recoveryPassword(loginRequest))
      this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
      this.isLoading = false;
      this.router.navigate(['/login']);
      } catch (error) {

      }finally{
        this.isLoading = false;
      }
    }
  }
}
