import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-simple-layout',
  standalone: true,
  imports: [RouterOutlet,ToastModule ],
  templateUrl: './simple-layout.component.html',
  styleUrl: './simple-layout.component.css'
})
export class SimpleLayoutComponent {

}
