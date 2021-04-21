import { Component, OnInit } from '@angular/core';
import { CommandCenterService } from './command-center.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private commandCenterService: CommandCenterService) { }
  public temp: number;
  public error: string;
  ngOnInit(): void {
    this.commandCenterService.getTemp().subscribe(
      data => {
        this.temp = data;
      },
      error => {
        this.error = error;
      });
  }

  
}
