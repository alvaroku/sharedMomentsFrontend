import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { MomentResponse } from '../../../models/moment-response.model';
import { DataDropDown } from '../../../../../shared/models/data-dropdown.model';
import { ShareMomentResponse } from '../../../models/share-moment-response.model';
import { ResultPattern } from '../../../../../shared/models/result-pattern.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MomentService } from '../../../services/moment.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../../user/services/user.service';
import { firstValueFrom } from 'rxjs';
import { MomentUserResponse } from '../../../models/moment-user-response.model';
import { ShareMomentRequest } from '../../../models/share-moment-request.model';
import { AlbumService } from '../../../../album/services/album.service';
import { DropdownModule } from 'primeng/dropdown';
import { AddToAlbumRequest } from '../../../models/add-to-album-request.model';
import { AddToAlbumResponse } from '../../../models/add-to-album-response.model';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-add-to-album',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,DropdownModule ,ButtonModule,LoadingComponent],
  templateUrl: './add-to-album.component.html',
  styleUrl: './add-to-album.component.css'
})
export class AddToAlbumComponent  implements OnInit {
  isLoading: boolean = false;
  moment: MomentResponse | null = null;
  shareForm!: FormGroup;
  options: DataDropDown[] = [];
  allOptions: DataDropDown[] = [];
  result:{result:ResultPattern<AddToAlbumResponse>,requireUpdate:boolean} = {result:{data:{albumId:undefined},message:'',isSuccess:false,statusCode:0},requireUpdate:false}
  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef<AddToAlbumComponent>,
    private fb: FormBuilder,
    private momentService:MomentService,
    private messageService: MessageService,
    private albumService:AlbumService,
    private confirmationService: ConfirmationService
  ) {
    this.moment = this.config.data._moment
   }

   async ngOnInit() {
    this.shareForm = this.fb.group({
      albumId: [this.moment?.albumId],
      momentId:[this.moment?.id]
    });
    await this.loadAlbums()

   }
   onDialogClose(): void {
    // Regresa un dato cuando el diálogo se cierra
    this.ref.close(this.result);
  }
   async loadAlbums(){
    this.isLoading = true;
    let response:ResultPattern<DataDropDown[]> = await firstValueFrom(this.albumService.getMyAlbums())
    this.options = response.data;
    this.isLoading = false;
   }

  async onSubmit() {
    if (this.shareForm.valid) {
       try {
        this.isLoading = true;
        let payload:AddToAlbumRequest= this.shareForm.value;
        if(payload.albumId==undefined && this.moment?.albumId == undefined){
           this.ref.close(this.result);
           return;
        }

       let response:ResultPattern<AddToAlbumResponse> = await firstValueFrom(this.momentService.addToAlbum(payload))
       let requireReload:boolean = false;
       if(this.moment?.albumId){
        if(response.data.albumId == undefined){
          requireReload = true;
        }else if(response.data.albumId != this.moment?.albumId){
          requireReload = true;

        }
       }else if(this.moment?.albumId == undefined){
        if(response.data.albumId != undefined){
          requireReload = true;
        }

       }

       this.result = {result:response,requireUpdate:requireReload};
       this.moment!.albumId = response.data.albumId
       this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });


       this.ref.close(this.result);//servía para cerrar el modal y enviar el dato al componente padre para actualizar la lista de usuarios compartidos
     } catch (error) {

     } finally {
      this.isLoading = false;
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

}
