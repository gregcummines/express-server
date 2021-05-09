import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';
import { Role } from './models/role';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {
    path: '', 
    component: HomeComponent, 
    canActivate: [AuthGuard],
    data: {
      role: Role.User
    }
  },
  {
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'register', 
    component: RegisterComponent
  },
  {
    path: 'forgot-password', 
    component: ForgotPasswordComponent
  },
  {
    path: 'operations', 
    component: OperationsComponent, 
    canActivate: [AuthGuard], 
    data: {
      role: Role.User
    }
  },
  {
    path: 'manage-users', 
    component: ManageUsersComponent, 
    canActivate: [AuthGuard], 
    data: {
      role: Role.Admin
    }
  },
  {
    path: 'home', 
    component: HomeComponent, 
    canActivate: [AuthGuard],
    data: {
      role: Role.User
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
