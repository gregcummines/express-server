import { Component, OnInit } from '@angular/core';
import { CommandCenterService } from './command-center.service';
import { WebSocketSubject } from 'rxjs/webSocket';

export class Message {
  constructor(
      public sender: string,
      public content: string,
      public isBroadcast = false,
  ) { }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private commandCenterService: CommandCenterService) { 
    this.socket$ = new WebSocketSubject('ws://192.168.0.188:5002');

    this.socket$
        .subscribe(
          (message) => {
            console.log(`Message received: ${message}`);
          },
          (err) => console.error(err),
          () => console.warn('Completed!')
        );
  }
  public temp: number;
  public error: string;
  private socket$: WebSocketSubject<Message>;

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
