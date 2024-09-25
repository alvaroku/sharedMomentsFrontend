import { Component, OnInit } from '@angular/core';
import { ProfileResponse } from '../../models/profile-response.model';
import { CommonModule } from '@angular/common';

import { firstValueFrom } from 'rxjs';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ProfileService } from '../../services/profile.service';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ProfileRequest } from '../../models/profile-request.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FileUploadModule, FileUploadComponent, ButtonModule,ReactiveFormsModule,CalendarModule,InputTextModule,LoadingComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = false;
  userForm!: FormGroup;

  user!: ProfileResponse

  isEditMode = false;
  constructor(private profileService: ProfileService, private messageService: MessageService,private fb: FormBuilder,) {

  }
  async ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      profile: [null]
    });
    this.isLoading = true
    let response: ResultPattern<ProfileResponse> = await firstValueFrom(this.profileService.getProfile())
    this.user = response.data

      this.userForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        dateOfBirth: new Date(this.user.dateOfBirth)
      });
      this.isLoading = false

  }
  handleFileSelected(file?: File) {
   if (file) {
     this.userForm.patchValue({
       profile: file
     });
   }else{
      this.userForm.patchValue({
        profile: null
      });
   }
  }
  async onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true
      let payload:ProfileRequest = this.userForm.value
      let response: ResultPattern<ProfileResponse> = await firstValueFrom(this.profileService.updateProfile(payload))
      this.user = response.data
      this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
      this.isEditMode = !this.isEditMode
      this.isLoading = false
    }
  }
}
