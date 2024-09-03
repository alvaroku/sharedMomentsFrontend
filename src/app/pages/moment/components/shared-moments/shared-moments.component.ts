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

@Component({
  selector: 'app-shared-moments',
  standalone: true,
  imports: [CommonModule,MomentCardComponent,ButtonModule,PaginatorModule ,InputTextModule,TriStateCheckboxModule  ],
  templateUrl: './shared-moments.component.html',
  styleUrl: './shared-moments.component.css'
})
export class SharedMomentsComponent implements OnInit {


  defaultFilter:DefaultFilter = { pageNumber: 1, pageSize: 4,status:true,search:undefined };

  moments: MomentResponse[] = [];
  constructor(private momentService:MomentService) { }

  async ngOnInit() {
    await this.loadMoments();
  }

  async loadMoments() {
    let response: ResultPattern<PaginateResponse<MomentResponse>> = await firstValueFrom(this.momentService.getSharedWithMe(this.defaultFilter));
    this.moments = response.data.list;
    this.paginateComponent.totalRecords = response.data.totalRecords; // Asegúrate de que tu respuesta tenga el total de registros
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
