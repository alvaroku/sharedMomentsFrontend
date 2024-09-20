import { Component } from '@angular/core';
import { FileToObjectUrlPipe } from '../../../../shared/pipes/file-to-object-url.pipe';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { AlbumService } from '../../services/album.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlbumRequest } from '../../models/album-request.model';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { AlbumResponse } from '../../models/album-response.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-album',
  standalone: true,
  imports: [
    FileToObjectUrlPipe,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
  ],
  templateUrl: './create-album.component.html',
  styleUrl: './create-album.component.css'
})
export class CreateAlbumComponent {
  albumForm!: FormGroup;

  album:string | null = null;



  constructor(
    private fb: FormBuilder,
    private albumService: AlbumService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public ref: DynamicDialogRef<CreateAlbumComponent>, public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.albumForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.album = this.config.data._album;
    if (this.album) {
      this.loadForUpdate();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.albumForm.invalid) {
      return;
    }

     let request: AlbumRequest = this.albumForm.value

    try {
      this.showLoading();
      let response:ResultPattern<AlbumResponse>;
      if (this.album == null) {
        response = await firstValueFrom(this.albumService.create(request));
      } else {
        response = await firstValueFrom(this.albumService.update(this.album??'',request));
      }
      //this.album = response.data;
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
      const response:ResultPattern<AlbumResponse>= await firstValueFrom(this.albumService.getById(this.album??""));
      //this.moment = response.data;
      this.albumForm.patchValue({
        name: response.data.name,
        description:response.data.description,
      });

    } catch (error) {
      // Handle error
    } finally {
      this.hideLoading();
    }
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

  close(data: ResultPattern<AlbumResponse>): void {
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
