import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusComponent } from '../../components/status/status.component';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  public loginInvalid = false;
  private formSubmitAttempt = false;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.snackBar.dismiss();
  }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        const firstName = this.form.get('firstName')?.value;
        const lastName = this.form.get('lastName')?.value;
        const username = this.form.get('username')?.value;
        const password = this.form.get('password')?.value;

        this.authService.register(firstName, lastName, username, password)
        .pipe(first())
        .subscribe({
            next: (user) => {
                if (user && user.token) {
                  // get return url from route parameters or default to '/'
                  const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                  this.router.navigate([returnUrl]);
                } else {
                  this.setStatusMessage('User account is pending approval');
                  //this.router.navigate(['/login']);
                }
            },
            error: error => {
                this.error = error;
                this.loading = false;
            }
        });
      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

  setStatusMessage(statusMessage: string) {
    const snackBar = this.snackBar.openFromComponent(StatusComponent, {
      data: { 
        message: statusMessage,
        preClose: () => {snackBar.dismiss()} 
      },
      panelClass: ['blue-snackbar']
    });
  }
}
