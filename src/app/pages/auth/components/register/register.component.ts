import { Component } from '@angular/core';
import { UserRequest } from '../../models/user-request.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { AuthService } from '../../services/auth.service';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { UserResponse } from '../../models/user-response.model';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { LOCAL_STORAGE_CONSTANTS } from '../../../../shared/constants/local-storage.constants';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
  LoadingComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  isLoading: boolean = false;
  userForm: FormGroup;
  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' }
  ];

  constructor(private fb: FormBuilder,private authService: AuthService,private ls:LocalStorageService,private router: Router) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      passwordHash: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      roleId: [null]
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

 async onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true;
      const userRequest: UserRequest = this.userForm.value;
      let response:ResultPattern<UserResponse> = await firstValueFrom(this.authService.register(userRequest));
      this.ls.setItem(LOCAL_STORAGE_CONSTANTS.USER_KEY,response.data);
      this.authService.setCurrentUserState = response.data;
      this.isLoading = false;
      this.router.navigate(['/home']);
    }
  }
}
