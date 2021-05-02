import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OperationsComponent } from './components/operations/operations.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'operations', component: OperationsComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
