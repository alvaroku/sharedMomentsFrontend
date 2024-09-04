import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MomentCardComponent } from '../../../moment/components/moment-card/moment-card.component';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { AlbumResponse } from '../../models/album-response.model';
import { DefaultFilter } from '../../../../shared/models/default-filter.model';
import { AlbumService } from '../../services/album.service';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { PaginateResponse } from '../../../../shared/models/paginate-response.model';
import { firstValueFrom } from 'rxjs';
import { PaginatorEvent } from '../../../../shared/models/paginator-event.model';
import { AlbumCardComponent } from '../album-card/album-card.component';

@Component({
  selector: 'app-shared-albums',
  standalone: true,
  imports: [CommonModule,AlbumCardComponent,ButtonModule,PaginatorModule ,InputTextModule,TriStateCheckboxModule  ],
  templateUrl: './shared-albums.component.html',
  styleUrl: './shared-albums.component.css'
})
export class SharedAlbumsComponent implements OnInit {


  defaultFilter:DefaultFilter = { pageNumber: 1, pageSize: 4,status:true,search:undefined };

  albums: AlbumResponse[] = [];
  constructor(private albumService:AlbumService) { }

  async ngOnInit() {
    await this.loadAlbums();
  }

  async loadAlbums() {
    let response: ResultPattern<PaginateResponse<AlbumResponse>> = await firstValueFrom(this.albumService.getSharedWithMe(this.defaultFilter));
    this.albums = response.data.list;
    this.paginateComponent.totalRecords = response.data.totalRecords; // Asegúrate de que tu respuesta tenga el total de registros
  }


  paginateComponent: PaginatorEvent = {first:0,rows:4,page:1,totalRecords:0,pageCount:0};

  async onPageChange(event: any) {
    this.paginateComponent.first = event.first;
    this.paginateComponent.rows = event.rows;

    const pageNumber = (this.paginateComponent.first / this.paginateComponent.rows) + 1;

    this.defaultFilter.pageNumber = pageNumber;
    this.defaultFilter.pageSize = this.paginateComponent.rows;

    await this.loadAlbums();
  }

  async search(){
    await this.loadAlbums();
  }
}
