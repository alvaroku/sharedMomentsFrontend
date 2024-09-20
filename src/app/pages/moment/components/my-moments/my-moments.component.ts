
import { Component, Input, input, OnInit } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';

import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { MomentCardComponent } from '../moment-card/moment-card.component';
import { DefaultFilter } from '../../../../shared/models/default-filter.model';
import { MomentResponse } from '../../models/moment-response.model';
import { MomentService } from '../../services/moment.service';
import { PaginateResponse } from '../../../../shared/models/paginate-response.model';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { CreateMomentComponent } from '../create-moment/create-moment.component';
import { PaginatorEvent } from '../../../../shared/models/paginator-event.model';
import { FilterMomentParams } from '../../models/filter-moment-params.model';
import { MomentListComponent } from '../moment-list/moment-list.component';


@Component({
  selector: 'app-my-moments',
  standalone: true,
  imports: [CommonModule,MomentCardComponent,ButtonModule,PaginatorModule ,InputTextModule,TriStateCheckboxModule,MomentListComponent  ],
  templateUrl: './my-moments.component.html',
  styleUrl: './my-moments.component.css',
  providers: []
})
export class MyMomentsComponent implements OnInit {


  constructor(private momentService:MomentService,public dialogService: DialogService,private messageService: MessageService) { }

  async ngOnInit() {

  }



}

