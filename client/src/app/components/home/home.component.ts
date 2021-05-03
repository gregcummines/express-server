import { Component, OnInit } from '@angular/core';
import { CommandCenterService } from './command-center.service';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { SensorMessage } from './sensor-message';
import { RxSocketClientSubject } from './rx-socket-client.subject';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loaded: boolean = false;
  constructor(private commandCenterService: CommandCenterService, private http: HttpClient) { 
    this.socket$ = new RxSocketClientSubject({
      url: `ws://${environment.apiUrl}`,
      reconnectAttempts: 604800,  
      reconnectInterval: 5000
    });

    this.socket$
        .subscribe(
          (data) => {
            if (!this.loaded) {
              this.sensors = data;
              // TODO: Uncomment the following line if you don't want the DOM refreshing so you
              // can use Chrome debugger to inspect elements. Otherwise they keep getting recreated.
              //this.loaded = true;
            }
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

  onRefresh(i: number) {

  }
}
