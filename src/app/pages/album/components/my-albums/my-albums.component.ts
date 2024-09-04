import { Component, OnInit } from '@angular/core';
import { PaginatorEvent } from '../../../../shared/models/paginator-event.model';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { PaginateResponse } from '../../../../shared/models/paginate-response.model';
import { AlbumResponse } from '../../models/album-response.model';
import { firstValueFrom } from 'rxjs';
import { AlbumService } from '../../services/album.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { DefaultFilter } from '../../../../shared/models/default-filter.model';
import { CreateAlbumComponent } from '../create-album/create-album.component';
import { CommonModule } from '@angular/common';
import { MomentCardComponent } from '../../../moment/components/moment-card/moment-card.component';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { AlbumCardComponent } from '../album-card/album-card.component';

@Component({
  selector: 'app-my-albums',
  standalone: true,
  imports: [CommonModule,AlbumCardComponent,ButtonModule,PaginatorModule ,InputTextModule,TriStateCheckboxModule  ],
  templateUrl: './my-albums.component.html',
  styleUrl: './my-albums.component.css'
})
export class MyAlbumsComponent implements OnInit {
  ref: DynamicDialogRef<CreateAlbumComponent> | undefined;

  defaultFilter:DefaultFilter = { pageNumber: 1, pageSize: 4,status:true,search:undefined };

  albums: AlbumResponse[] = [];
  constructor(private albumService:AlbumService,public dialogService: DialogService,private messageService: MessageService) { }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    let response: ResultPattern<PaginateResponse<AlbumResponse>> = await firstValueFrom(this.albumService.getAll(this.defaultFilter));
    this.albums = response.data.list;
    this.paginateComponent.totalRecords = response.data.totalRecords; // Asegúrate de que tu respuesta tenga el total de registros
  }

  createAlbum(): void {
    this.ref = this.dialogService.open(CreateAlbumComponent, {
      header: 'Nuevo'
  });
  this.ref.onClose.subscribe(async (result: ResultPattern<AlbumResponse>) => {
    if (result) {
      await this.loadData();
    }
  });
  }
  paginateComponent: PaginatorEvent = {first:0,rows:4,page:1,totalRecords:0,pageCount:0};

  async onPageChange(event: any) {
    this.paginateComponent.first = event.first;
    this.paginateComponent.rows = event.rows;

    const pageNumber = (this.paginateComponent.first / this.paginateComponent.rows) + 1;

    this.defaultFilter.pageNumber = pageNumber;
    this.defaultFilter.pageSize = this.paginateComponent.rows;

    await this.loadData();
  }

  async search(){
    await this.loadData();
  }
}
