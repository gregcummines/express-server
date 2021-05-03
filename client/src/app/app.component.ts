import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Walrus';

  ngOnInit() {
  }

  constructor(
    private authService: AuthService
  ) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
    }
  }
}
