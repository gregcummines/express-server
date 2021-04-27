import { Component, OnInit } from '@angular/core';
import { CommandCenterService } from './command-center.service';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { SensorMessage } from './sensor-message';
import { RxSocketClientSubject } from './rx-socket-client.subject';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private commandCenterService: CommandCenterService) { 
    this.socket$ = new RxSocketClientSubject({
      url: 'ws://192.168.0.188.3002'
    });

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
  private socket$: RxSocketClientSubject<SensorMessage[]>;

  ngOnInit(): void {
  }
}
