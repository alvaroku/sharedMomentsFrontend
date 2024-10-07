import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { AuthService } from '../../../../auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResultPattern } from '../../../../../shared/models/result-pattern.model';
import { ChangePasswordResponse } from '../../../models/change-password-response.model';
import { firstValueFrom } from 'rxjs';
import { CreateAlbumComponent } from '../../../../album/components/create-album/create-album.component';
import { ChangePasswordRequest } from '../../../models/change-password-request.model';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ButtonModule, ReactiveFormsModule, InputTextModule, LoadingComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  isLoading: boolean = false;
  userForm!: FormGroup;

  constructor(private authService: AuthService,
    private messageService: MessageService,
    private fb: FormBuilder,
    public ref: DynamicDialogRef<CreateAlbumComponent>) {

  }
  async ngOnInit() {
    this.userForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMatchValidator() }); // Aplica el validador personalizado
  }
  async submit() {
   if(!this.userForm.valid)
    return
    try{
      this.isLoading = true
    let request: ChangePasswordRequest = this.userForm.value
    let response: ResultPattern<ChangePasswordResponse> = await firstValueFrom(this.authService.changePassword(request))

    this.ref.close();
    this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
    }catch{}
    finally{
      this.isLoading =  false
  }
}}
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordsMismatch: true };
    }
    return null;
  };
}
