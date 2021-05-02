import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Walrus';
  public isAuthenticated: boolean = false;

  ngOnInit() {
  }

  constructor() { }

  async logout(): Promise<void> {
    // todo
  }
}
