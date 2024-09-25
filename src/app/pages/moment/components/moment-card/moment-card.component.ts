import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MomentResponse } from '../../models/moment-response.model';
import { MomentService } from '../../services/moment.service';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CreateMomentComponent } from '../create-moment/create-moment.component';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ResourceResponse } from '../../models/resource-response.model';
import { GalleriaModule } from 'primeng/galleria';
import { ShareMomentRequest } from '../../models/share-moment-request.model';
import { ShareMomentComponent } from '../modals/share-moment/share-moment.component';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { MomentUserResponse } from '../../models/moment-user-response.model';
import { ShareMomentResponse } from '../../models/share-moment-response.model';
import { AddToAlbumComponent } from '../modals/add-to-album/add-to-album.component';
import { AddToAlbumResponse } from '../../models/add-to-album-response.model';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-moment-card',
  standalone: true,
  imports: [CommonModule,ButtonModule,GalleriaModule,AvatarModule ],
  templateUrl: './moment-card.component.html',
  styleUrl: './moment-card.component.css',
  providers: []
})
export class MomentCardComponent implements OnInit {
  ref: DynamicDialogRef<CreateMomentComponent> | undefined;
  ref2: DynamicDialogRef<ShareMomentComponent> | undefined;
  ref3: DynamicDialogRef<AddToAlbumComponent> | undefined;
  @Input() moment!: MomentResponse;
  @Output() reloadEvent = new EventEmitter<void>();
  currentIndex: number = 0;
  imOwner:boolean = false;

  constructor(
    private momentService:MomentService,
    public dialogService: DialogService,
    private authService:AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService, ) { }
  async ngOnInit() {
    this.imOwner = this.moment.ownerId == (await firstValueFrom(this.authService.getCurrentUserState))?.id
    setInterval(() => {
      this.showNextImage();
    }, 3000);
  }

  showNextImage(): void {
    const momentCardId = 'moment-card-'+this.moment.id;
    const images = document.querySelectorAll(`#${momentCardId} .carousel-image`);
    if (images.length > 0) {
      (images[this.currentIndex] as HTMLElement).style.display = 'none';
      this.currentIndex = (this.currentIndex + 1) % images.length;
      (images[this.currentIndex] as HTMLElement).style.display = 'block';
    }
  }

  editMoment(): void {
    this.ref = this.dialogService.open(CreateMomentComponent, {
      data: {
          id: this.moment.id
      },
      header: 'Editar'
  });
  this.ref.onClose.subscribe((result: any) => {
    if (result) {
      this.moment = result.data;

    }
  });
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
  async deleteMoment(): Promise<void> {

      try {
        if(!await this.confirm1('¿Estás seguro de que deseas eliminar este momento?','Confirmar eliminación'))
          return;
        let response = await firstValueFrom(this.momentService.delete(this.moment.id))

        this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
        this.reloadEvent.emit();
      } catch (error) {
        // Handle error
      } finally {
        //hideLoading();
      }

  }
  async shareMoment(): Promise<void> {
    this.ref2 = this.dialogService.open(ShareMomentComponent, {
      header: 'Compartir',
      height: '445px',
      width: '350px',
      data: {
        _moment: this.moment
      }
  });
  this.ref2.onClose.subscribe(async (result: {result:ResultPattern<ShareMomentResponse[]>|undefined,deleteUsers:string[]}) => {
    //no fue necesario modificar el momento ya que al pasa el objeto
    // por referencia se actualiza automaticamente en el componente ShareMoment
    if (result) {
      if(result.deleteUsers.length > 0){
        // this.moment.sharedWith = this.moment.sharedWith.filter((x: MomentUserResponse) => !result.deleteUsers.includes(x.userId));
      }
      if(result.result){
       // this.moment.sharedWith.push(...result.result.data);
      }
    }
    else{
    }
  });


}
  imageData:imageData[] = []
  displayBasic: boolean = false;
  responsiveOptions: any[] = [
    {
        breakpoint: '1500px',
        numVisible: 5
    },
    {
        breakpoint: '1024px',
        numVisible: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];
  showModal(){
    let _title = this.moment.title;
    this.imageData = this.moment.resources.map((item: ResourceResponse) => {
      return {
        itemImageSrc: item.url,
        thumbnailImageSrc: item.url,
        alt: _title,
        title: _title
      };
    });
    this.displayBasic = true;
  }

  async addToAlbum(): Promise<void> {
    this.ref3 = this.dialogService.open(AddToAlbumComponent, {
      header: 'Agregar a álbum',

      width: '350px',
      data: {
        _moment: this.moment
      }
  });
  this.ref3.onClose.subscribe(async (result:{result:ResultPattern<AddToAlbumResponse>,requireUpdate:boolean}) => {
    //no fue necesario modificar el momento ya que al pasa el objeto
    // por referencia se actualiza automaticamente en el componente ShareMoment
    console.log(result);
    if (result) {
      if(result.requireUpdate){
        this.reloadEvent.emit();
        // this.moment.sharedWith = this.moment.sharedWith.filter((x: MomentUserResponse) => !result.deleteUsers.includes(x.userId));
      }
      else{
       // this.moment.sharedWith.push(...result.result.data);
      }
    }
    else{
    }
  });


}
}
interface imageData{
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}
