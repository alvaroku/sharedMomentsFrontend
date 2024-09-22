import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResultPattern } from '../../../../../shared/models/result-pattern.model';
import { MomentResponse } from '../../../models/moment-response.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ShareMomentRequest } from '../../../models/share-moment-request.model';
import { DataDropDown } from '../../../../../shared/models/data-dropdown.model';
import { firstValueFrom } from 'rxjs';
import { MomentService } from '../../../services/moment.service';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../../user/services/user.service';
import { ShareMomentResponse } from '../../../models/share-moment-response.model';
import { MomentUserResponse } from '../../../models/moment-user-response.model';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-share-moment',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MultiSelectModule,ButtonModule,AvatarModule,CheckboxModule,FormsModule],
  templateUrl: './share-moment.component.html',
  styleUrl: './share-moment.component.css'
})
export class ShareMomentComponent implements OnInit {
  moment: MomentResponse | null = null;
  shareForm!: FormGroup;
  options: DataDropDown[] = [];
  allOptions: DataDropDown[] = [];
  resultShared:{result:ResultPattern<ShareMomentResponse[]>,deleteUsers:string[]}
  = {result:{data:[],message:'',isSuccess:false,statusCode:0},deleteUsers:[]}
  isChecked:boolean = false;
  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef<ShareMomentComponent>,
    private fb: FormBuilder,
    private momentService:MomentService,
    private messageService: MessageService,
    private userService:UserService,
    private confirmationService: ConfirmationService
  ) {
    this.moment = this.config.data._moment
   }

   async ngOnInit() {
    this.shareForm = this.fb.group({
      sharedUsersId: [[], Validators.required]
    });
    await this.loadUsers()
    this.getOptionUsers()
   }
   onDialogClose(): void {
    // Regresa un dato cuando el diálogo se cierra
    this.ref.close(this.resultShared);
  }
   async loadUsers(){
    let response:ResultPattern<DataDropDown[]> = await firstValueFrom(this.userService.DataDropDownForShareMoment())
    this.allOptions = response.data;
   }
async getOptionUsers(){
  this.options = this.allOptions.filter((option: DataDropDown) => {
    return !this.moment?.sharedWith.some((sharedUser: MomentUserResponse) => sharedUser.userId === option.id);
  });
}
  async onSubmit() {
    if (this.shareForm.valid) {
       try {

        let payload:ShareMomentRequest= {sharedUsersId:this.shareForm.value.sharedUsersId.map((x:DataDropDown)=>x.id)}
       let response:ResultPattern<ShareMomentResponse[]> = await firstValueFrom(this.momentService.share(this.moment?.id??'',payload))
       this.resultShared.result = response;
       this.moment?.sharedWith.push(...response.data)
       this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
       this.shareForm.reset();
       this.getOptionUsers()
       //this.ref.close(this.resultShared);//servía para cerrar el modal y enviar el dato al componente padre para actualizar la lista de usuarios compartidos
     } catch (error) {

     } finally {

     }
    }
  }
  confirm1(_message:string,title:string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        message: _message,
        header: title,
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
          resolve(true); // Resolviendo la promesa con true si se acepta
        },
        reject: () => {
          resolve(false); // Resolviendo la promesa con false si se rechaza
        }
      });
    });
  }
  async deleteSharedUser(userId:string){
    if(!await this.confirm1('¿Estás seguro de que deseas dejar de compartir este momento con el usuario?','Confirmar eliminación'))
      return
    try{
      let response:ResultPattern<boolean> = await firstValueFrom(this.momentService.deleteShare(userId,this.moment?.id??''))
      this.resultShared.deleteUsers.push(userId)
      this.moment!.sharedWith = this.moment!.sharedWith.filter((x: MomentUserResponse) => x.userId !== userId);
      this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
      this.getOptionUsers()
    }catch(error){}
  }
}
