import { Component, OnInit } from '@angular/core';
import { AlbumResponse } from '../../../models/album-response.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataDropDown } from '../../../../../shared/models/data-dropdown.model';
import { ResultPattern } from '../../../../../shared/models/result-pattern.model';
import { ShareAlbumResponse } from '../../../models/share-album-response.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlbumService } from '../../../services/album.service';
import { UserService } from '../../../../user/services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { AlbumUserResponse } from '../../../models/album-user-response.model';
import { ShareAlbumRequest } from '../../../models/share-album-request.model';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-share-album',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MultiSelectModule,ButtonModule],
  templateUrl: './share-album.component.html',
  styleUrl: './share-album.component.css'
})
export class ShareAlbumComponent implements OnInit {
  album: AlbumResponse | null = null;
  shareForm!: FormGroup;
  options: DataDropDown[] = [];
  allOptions: DataDropDown[] = [];
  resultShared:{result:ResultPattern<ShareAlbumResponse[]>,deleteUsers:string[]}
  = {result:{data:[],message:'',isSuccess:false,statusCode:0},deleteUsers:[]}
  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef<ShareAlbumComponent>,
    private fb: FormBuilder,
    private albumService:AlbumService,
    private messageService: MessageService,
    private userService:UserService,
    private confirmationService: ConfirmationService
  ) {
    this.album = this.config.data._album
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
    return !this.album?.sharedWith.some((sharedUser: AlbumUserResponse) => sharedUser.userId === option.id);
  });
}
  async onSubmit() {
    if (this.shareForm.valid) {
       try {

        let payload:ShareAlbumRequest= {sharedUsersId:this.shareForm.value.sharedUsersId.map((x:DataDropDown)=>x.id)}
       let response:ResultPattern<ShareAlbumResponse[]> = await firstValueFrom(this.albumService.share(this.album?.id??'',payload))
       this.resultShared.result = response;
       this.album?.sharedWith.push(...response.data)
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
    if(!await this.confirm1('¿Estás seguro de que deseas dejar de compartir este albúm con el usuario?','Confirmar eliminación'))
      return
    try{
      let response:ResultPattern<boolean> = await firstValueFrom(this.albumService.deleteShare(userId,this.album?.id??''))
      this.resultShared.deleteUsers.push(userId)
      this.album!.sharedWith = this.album!.sharedWith.filter((x: AlbumUserResponse) => x.userId !== userId);
      this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
      this.getOptionUsers()
    }catch(error){}
  }
}
