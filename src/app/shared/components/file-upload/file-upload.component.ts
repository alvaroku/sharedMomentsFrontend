import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FileUploadModule ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  @Input() uploadText: string = '';
  @Input() allowedFileTypes: string = '';
  @Input() multiple: boolean = false;
  @Output() fileSelected = new EventEmitter<File|undefined>();
  onUpload(event: any) {
    this.fileSelected.emit(event.currentFiles[0]);
  }
}
