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

    this.wss.on('connection', function connection(ws: CustomSocket, req: IncomingMessage) {
        ws.on('pong', () => ws.isAlive = true)
        
        const ip = req.socket.remoteAddress;
        console.log(`${ip} has connected...`);
        
        //send immediatly a feedback to the incoming connection and every interval thereafter  
        self.wss.clients
            .forEach(client => {
                client.send(self.getSensorStatuses());
            });
        setInterval(() => {
            self.wss.clients
            .forEach(client => {
                client.send(self.getSensorStatuses());
            });
        }, 10000);
        
        self.wss.on('error', (err) => {
            console.warn(`Client disconnected - reason: ${err}`);
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