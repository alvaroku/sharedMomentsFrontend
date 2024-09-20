import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CreateAlbumComponent } from '../create-album/create-album.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ShareAlbumComponent } from '../modals/share-album/share-album.component';
import { AlbumResponse } from '../../models/album-response.model';
import { AlbumService } from '../../services/album.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { ShareAlbumResponse } from '../../models/share-album-response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-album-card',
  standalone: true,
  imports: [CommonModule,ButtonModule, ],
  templateUrl: './album-card.component.html',
  styleUrl: './album-card.component.css'
})
export class AlbumCardComponent implements OnInit {
  ref: DynamicDialogRef<CreateAlbumComponent> | undefined;
  ref2: DynamicDialogRef<ShareAlbumComponent> | undefined;
  @Input() album!: AlbumResponse;
  @Output() reloadEvent = new EventEmitter<void>();
  imOwner:boolean = false;

  constructor(
    private albumService:AlbumService,
    public dialogService: DialogService,
    private authService:AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
   ) { }
  async ngOnInit() {
    this.imOwner = this.album.ownerId == (await firstValueFrom(this.authService.getCurrentUserState))?.id
  }



  editAlbum(): void {
    this.ref = this.dialogService.open(CreateAlbumComponent, {
      data: {
          _album: this.album.id
      },
      header: 'Editar'
  });
  this.ref.onClose.subscribe((result: ResultPattern<AlbumResponse>) => {
    if (result) {
      this.album = result.data;

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
  async deleteAlbum(): Promise<void> {

      try {
        if(!await this.confirm1('¿Estás seguro de que deseas eliminar este albúm?','Confirmar eliminación'))
          return;
        let response = await firstValueFrom(this.albumService.delete(this.album.id))

        this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
        this.reloadEvent.emit();
      } catch (error) {
        // Handle error
      } finally {
        //hideLoading();
      }

  }
  async shareAlbum(): Promise<void> {
    this.ref2 = this.dialogService.open(ShareAlbumComponent, {
      header: 'Compartir',
      height: '445px',
      width: '350px',
      data: {
        _album: this.album
      }
  });
  this.ref2.onClose.subscribe(async (result: {result:ResultPattern<ShareAlbumResponse[]>|undefined,deleteUsers:string[]}) => {
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
navigateToAlbum(albumId: string): void {
  this.router.navigate(['/moments-by-album', albumId]);
}
}
