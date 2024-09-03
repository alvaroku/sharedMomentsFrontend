import { MomentService } from './../services/moment.service';
import { Component, OnInit } from '@angular/core';
import { MomentCardComponent } from './moment-card/moment-card.component';
import { MomentResponse } from '../models/moment-response.model';
import { ResultPattern } from '../../../shared/models/result-pattern.model';
import { PaginateResponse } from '../../../shared/models/paginate-response.model';
import { firstValueFrom } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateMomentComponent } from './create-moment/create-moment.component';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorEvent } from '../../../shared/models/paginator-event.model';
import { DefaultFilter } from '../../../shared/models/default-filter.model';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { MomentUserResponse } from '../models/moment-user-response.model';

@Component({
  selector: 'app-moment',
  standalone: true,
  imports: [CommonModule,MomentCardComponent,ButtonModule,PaginatorModule ,InputTextModule,TriStateCheckboxModule  ],
  templateUrl: './moment.component.html',
  styleUrl: './moment.component.css',
  providers: []
})
export class MomentComponent implements OnInit {
  ref: DynamicDialogRef | undefined;

  defaultFilter:DefaultFilter = { pageNumber: 1, pageSize: 4,status:true,search:undefined };

  moments: MomentResponse[] = [];
  constructor(private momentService:MomentService,public dialogService: DialogService,private messageService: MessageService) { }

  async ngOnInit() {
    await this.loadMoments();
  }

  async loadMoments() {
    let response: ResultPattern<PaginateResponse<MomentResponse>> = await firstValueFrom(this.momentService.getAll(this.defaultFilter));
    this.moments = response.data.list;
    this.paginateComponent.totalRecords = response.data.totalRecords; // Asegúrate de que tu respuesta tenga el total de registros
  }

  createMoment(): void {
    this.ref = this.dialogService.open(CreateMomentComponent, {
      header: 'Nuevo'
  });
  this.ref.onClose.subscribe(async (result: any) => {
    if (result) {
      await this.loadMoments();
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

    await this.loadMoments();
  }

  async search(){
    await this.loadMoments();
  }
}

