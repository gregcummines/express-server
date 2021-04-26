import { Component, OnInit } from '@angular/core';
import { CommandCenterService } from './command-center.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { SensorMessage } from './sensor-message';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private commandCenterService: CommandCenterService) { 
    this.socket$ = new WebSocketSubject('ws://192.168.0.188:3002');

    this.socket$
        .subscribe(
          (data) => {
            this.sensors = data;
          },
          (err) => console.error(err),
          () => console.warn('Completed!')
        );
  }
  public sensors: SensorMessage[] = [];
  public error: string;
  private socket$: WebSocketSubject<Message>;

  ngOnInit(): void {
    // this.commandCenterService.getTemp().subscribe(
    //   data => {
    //     this.temp = data;
    //   },
    //   error => {
    //     this.error = error;
    //   });
  }
}
