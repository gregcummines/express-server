import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Role } from './models/role';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Walrus';
  currentUser: User;
  
  ngOnInit() {
  }

  constructor(
    private authService: AuthService
  ) { 
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  logout(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
    }
  }
}
