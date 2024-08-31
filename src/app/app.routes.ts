import { Routes } from '@angular/router';
import { MenuLayoutComponent } from './layouts/menu-layout/menu-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout/simple-layout.component';
import { LoginComponent } from './pages/auth/components/login/login.component';
import { RegisterComponent } from './pages/auth/components/register/register.component';
import { HomeComponent } from './pages/home/components/home/home.component';
import { MomentComponent } from './pages/moment/components/moment.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: MenuLayoutComponent,
    children: [
       { path: 'home', component: HomeComponent },
       { path: 'moment', component: MomentComponent },
       // Otras rutas que necesiten el menú

     ]
  },
  {
    path: '',
    component: SimpleLayoutComponent,
     children: [
       { path: 'login', component: LoginComponent },
       { path: 'register', component: RegisterComponent },
       // Otras rutas que no necesiten el menú
     ]
  },
  { path: '**', redirectTo: 'home' }
];
