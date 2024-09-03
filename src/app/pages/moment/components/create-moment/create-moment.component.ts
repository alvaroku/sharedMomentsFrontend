import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { MomentService } from '../../services/moment.service';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { MomentResponse } from '../../models/moment-response.model';
import { firstValueFrom } from 'rxjs';
import { MomentRequest } from '../../models/moment-request.model';
import { CommonModule } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ResourceService } from '../../../resource/services/resource.service';
import { FileToObjectUrlPipe } from '../../../../shared/pipes/file-to-object-url.pipe';
import { FileUploadModule } from 'primeng/fileupload';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-create-moment',
  standalone: true,
  imports: [
    FileToObjectUrlPipe,
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    InputTextModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    FileUploadModule,ToastModule

  ],
  templateUrl: './create-moment.component.html',
  styleUrl: './create-moment.component.css'
})
export class CreateMomentComponent {
  momentForm!: FormGroup;
  fileList: File[] = [];
  preloadedImages: any[] = [];
  moment: any = null;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private momentService: MomentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private resourceService:ResourceService,
    public ref: DynamicDialogRef<CreateMomentComponent>, public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.momentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      place: ['', Validators.required],
      images: [null, Validators.required]
    });

    const urlParams = new URLSearchParams(window.location.search);
    this.id = this.config.data.id
    if (this.id) {
      this.loadForUpdate();
    }
  }

  onFileSelect(event: any): void {
    for (let file of event.files) {
      this.fileList.push(file);
    }
    this.verifyRequiredFileForUpdate();
  }

  onFileRemove(event: any): void {
    const index = this.fileList.indexOf(event.file);
    if (index > -1) {
      this.fileList.splice(index, 1);
    }
    this.verifyRequiredFileForUpdate();
  }

  async onSubmit(): Promise<void> {
    if (this.momentForm.invalid) {
      return;
    }

     let request: MomentRequest = this.momentForm.value

    try {
      this.showLoading();
      let response:ResultPattern<MomentResponse>;
      if (this.id == null) {
        response = await firstValueFrom(this.momentService.create(request, this.fileList));
      } else {
        response = await firstValueFrom(this.momentService.update(this.config.data.id,request, this.fileList));
      }
      this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
      this.close(response);
    } catch (error) {
    } finally {
      this.hideLoading();
    }
  }

  async loadForUpdate(): Promise<void> {
    try {
      this.showLoading();
      const response:ResultPattern<MomentResponse>= await firstValueFrom(this.momentService.getById(this.id??""));
      this.moment = response.data;
      this.momentForm.patchValue({
        title: this.moment.title,
        description: this.moment.description,
        date: new Date(this.moment.date),
        place: this.moment.place
      });

      this.preloadedImages = this.moment.resources;

      this.verifyRequiredFileForUpdate();
    } catch (error) {
      // Handle error
    } finally {
      this.hideLoading();
    }
  }

  async removePreloadedImage(resource: any): Promise<void> {
    if(!await this.confirm1('¿Estás seguro de que deseas eliminar esta imagen?','Confirmar eliminación'))
      return;
    const response:ResultPattern<boolean> = await firstValueFrom(this.resourceService.delete(resource.id));
    const index = this.preloadedImages.indexOf(resource);
    if (index > -1) {
      this.preloadedImages.splice(index, 1);
    }
    this.verifyRequiredFileForUpdate();
    this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
  }

  verifyRequiredFileForUpdate(): void {
    if (this.preloadedImages.length > 0 || this.fileList.length > 0) {
      this.momentForm.get('images')?.clearValidators();
    } else {
      this.momentForm.get('images')?.setValidators([Validators.required]);
    }
    this.momentForm.get('images')?.updateValueAndValidity();
  }

  showLoading(): void {
    // Implement show loading logic
  }

  hideLoading(): void {
    // Implement hide loading logic
  }

  showAlertWithCallback(title: string, message: string, type: string, callback: () => void): void {
    // Implement show alert with callback logic
  }

  close(data: ResultPattern<MomentResponse>): void {
  this.ref.close(data);
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
