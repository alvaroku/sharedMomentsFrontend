import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResultPattern } from '../../../../../shared/models/result-pattern.model';
import { MomentResponse } from '../../../models/moment-response.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ShareMomentRequest } from '../../../models/share-moment-request.model';
import { DataDropDown } from '../../../../../shared/models/data-dropdown.model';
import { firstValueFrom } from 'rxjs';
import { MomentService } from '../../../services/moment.service';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../../user/services/user.service';
import { ShareMomentResponse } from '../../../models/share-moment-response.model';
import { MomentUserResponse } from '../../../models/moment-user-response.model';

@Component({
  selector: 'app-share-moment',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MultiSelectModule,ButtonModule],
  templateUrl: './share-moment.component.html',
  styleUrl: './share-moment.component.css'
})
export class ShareMomentComponent implements OnInit {
  moment: MomentResponse | null = null;
  shareForm!: FormGroup;
  options: DataDropDown[] = [];
  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef<ShareMomentComponent>,
    private fb: FormBuilder,
    private momentService:MomentService,
    private messageService: MessageService,
    private userService:UserService
  ) {
    this.moment = this.config.data._moment
   }

   ngOnInit(): void {
    this.shareForm = this.fb.group({
      sharedUsersId: [[], Validators.required]
    });
this.loadUsers()
   }
   async loadUsers(){
    let response:ResultPattern<DataDropDown[]> = await firstValueFrom(this.userService.DataDropDownForShareMoment())
    this.options = response.data.filter((option: DataDropDown) => {
      return !this.moment?.sharedWith.some((sharedUser: MomentUserResponse) => sharedUser.userId === option.id);
    });
   }
  close(data: ResultPattern<ShareMomentResponse[]>): void {
    this.ref.close(data);
  }
  async onSubmit() {
    if (this.shareForm.valid) {
       try {

        let payload:ShareMomentRequest= {sharedUsersId:this.shareForm.value.sharedUsersId.map((x:DataDropDown)=>x.id)}
       let response:ResultPattern<ShareMomentResponse[]> = await firstValueFrom(this.momentService.share(this.moment?.id??'',payload))
        this.close(response)
       this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
     } catch (error) {

     } finally {

     }
    }
  }
}
