import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MomentListComponent } from '../moment-list/moment-list.component';
import { AlbumResponse } from '../../../album/models/album-response.model';
import { AlbumService } from '../../../album/services/album.service';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moments-by-album',
  standalone: true,
  imports: [MomentListComponent,CommonModule],
  templateUrl: './moments-by-album.component.html',
  styleUrl: './moments-by-album.component.css'
})
export class MomentsByAlbumComponent implements OnInit {
  albumId?: string;
  album!:AlbumResponse
  constructor(private route: ActivatedRoute,private albumService:AlbumService) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.albumId = params.get('albumId')??undefined;
    });

    let responseAlbum:ResultPattern<AlbumResponse> = await firstValueFrom(this.albumService.getById(this.albumId??''));
    this.album = responseAlbum.data;
  }
}
