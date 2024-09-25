import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MomentCardComponent } from '../moment-card/moment-card.component';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { DefaultFilter } from '../../../../shared/models/default-filter.model';
import { MomentResponse } from '../../models/moment-response.model';
import { MomentService } from '../../services/moment.service';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { PaginateResponse } from '../../../../shared/models/paginate-response.model';
import { firstValueFrom } from 'rxjs';
import { PaginatorEvent } from '../../../../shared/models/paginator-event.model';
import { FilterMomentParams } from '../../models/filter-moment-params.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-shared-moments',
  standalone: true,
  imports: [CommonModule,MomentCardComponent,ButtonModule,PaginatorModule ,InputTextModule,TriStateCheckboxModule,LoadingComponent  ],
  templateUrl: './shared-moments.component.html',
  styleUrl: './shared-moments.component.css'
})
export class SharedMomentsComponent implements OnInit {
  isLoading: boolean = false;

  defaultFilter:FilterMomentParams = { pageNumber: 1, pageSize: 4,status:true,search:undefined,albumId:undefined,hasAlbum:false };

  moments: MomentResponse[] = [];
  constructor(private momentService:MomentService) { }

  async ngOnInit() {
    await this.loadMoments();
  }

  async loadMoments() {
    this.isLoading = true;
    let response: ResultPattern<PaginateResponse<MomentResponse>> = await firstValueFrom(this.momentService.getSharedWithMe(this.defaultFilter));
    this.moments = response.data.list;
    this.paginateComponent.totalRecords = response.data.totalRecords;
    this.isLoading = false;
  }


  paginateComponent: PaginatorEvent = {first:0,rows:4,page:1,totalRecords:0,pageCount:0};

  async onPageChange(event: any) {
    this.paginateComponent.first = event.first;
    this.paginateComponent.rows = event.rows;

    const pageNumber = (this.paginateComponent.first / this.paginateComponent.rows) + 1;

    this.defaultFilter.pageNumber = pageNumber;
    this.defaultFilter.pageSize = this.paginateComponent.rows;

    await this.loadMoments();
  }

  async search(){
    await this.loadMoments();
  }
}
