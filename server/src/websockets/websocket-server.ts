import {singleton} from "tsyringe";
import * as WebSocket from 'ws';
import { SensorMessage } from './sensor-message';
import { readAllF } from "ds18b20-raspi-typescript";
import { IncomingMessage } from "node:http";


interface CustomSocket extends WebSocket {
    isAlive: boolean
}

@singleton()
export class WebSocketServer {
  constructor() {
  }

  private wss: WebSocket.Server;

  setWss(wss: WebSocket.Server) {
    const self = this;
    console.log("Setting up websocket server...");
    this.wss = wss;

    wss.on('connection', function (ws) {
        const id = setInterval(function () {
          ws.send(self.getSensorStatuses(), function () {
            //
            // Ignore errors.
            //
          });
        }, 100);
        console.log('started client interval');
      
        ws.on('close', function () {
          console.log('stopping client interval');
          clearInterval(id);
        });
      });
  }

  getWss(): WebSocket.Server {
      return this.wss;
  }

  getSensorStatuses(): string {
    let sensorMessages: SensorMessage[] = []; 
    let tempSensors = readAllF(1);
    tempSensors.forEach( (sensor) => {
        sensorMessages.push(new SensorMessage(sensor.id, "temp", `${sensor.t.toString()}F`, new Date()));
    });
    return JSON.stringify(sensorMessages);
  }

  broadcastSensorsStatus(): void {
    this.wss.clients
        .forEach(client => {
            client.send(this.getSensorStatuses());
        });
  }
}