import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { AngularMaterialModule } from './angular-material.module';
import { MomentModule } from 'ngx-moment';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { JwtInterceptor } from './interceptors/jwt-interceptor';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { fakeBackendProvider } from './_helpers/fake-backend-provider';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { StatusComponent } from './components/status/status.component';
import { LoadingInterceptor } from './interceptors/loading-interceptor';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    OperationsComponent,
    ManageUsersComponent,
    ForgotPasswordComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, 
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        's': 59
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }

    // provider used to create fake backend
    //fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
