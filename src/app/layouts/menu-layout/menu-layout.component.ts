import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { AuthService } from '../../pages/auth/services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginResponse } from '../../pages/auth/models/login-response.model';
import { CardModule } from 'primeng/card';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-menu-layout',
  standalone: true,
  imports: [ConfirmDialogModule ,ButtonModule,CommonModule,RouterOutlet,CardModule,SidebarModule ,AvatarModule ,RouterLink,PanelMenuModule ,ToastModule],
  templateUrl: './menu-layout.component.html',
  styleUrl: './menu-layout.component.css',
})
export class MenuLayoutComponent {
  sidebarVisible: boolean = false;

  currentUser!: Observable<LoginResponse|null>;

  items!: MenuItem[];
  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUserState;
    this.currentUser.subscribe(loggedIn => {
      if (!loggedIn) {
        this.router.navigate(['/login']); // Redireccionar a la página de login si no está autenticado
      }else{
      //this.router.navigate(['/home']); // Redireccionar
      }
    });

    this.items = [
      {
          label: 'Menú',
          icon: 'pi pi-home',
          items: [
              {
                  label: 'Mis momentos',
                  icon: 'pi pi-book',
                  routerLink: '/my-moments'
              },
              {
                  label: 'Momentos compartidos',
                  icon: 'pi pi-copy',
                  routerLink: '/shared-moments'
              },
              {
                label: 'Mis albumes',
                icon: 'pi pi-address-book',
                routerLink: '/my-albums'
              },
              {
                label: 'Albumes compartidos',
                icon: 'pi  pi-users',
                routerLink: '/shared-albums'
              },
          ]
      },
      // {
      //     label: 'Programmatic',
      //     icon: 'pi pi-link',
      //     command: () => {
      //         this.router.navigate(['/moment']);
      //     }
      // },
      {
          label: 'Mi cuenta',
          icon: 'pi pi-user',
          items: [
              {
                  label: 'Perfil',
                  icon: 'pi pi-user-edit',
                  routerLink: '/profile'
              },
              {
                  label: 'Cerrar sesión',
                  icon: 'pi pi-sign-out',
                  command: () => {
                    this.logout()
                }
              }
          ]
      }
  ];
  }



  logout() {
    this.authService.logout();
  }
}
