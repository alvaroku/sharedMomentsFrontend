import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileToObjectUrl',
  standalone: true
})
export class FileToObjectUrlPipe implements PipeTransform {

  transform(file: File): string {
    return URL.createObjectURL(file);
  }

}
