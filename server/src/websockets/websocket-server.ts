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
    console.log("Setting up websocket server...");
    this.wss = wss;

    this.wss.on('connection', this.handleConnection);
  }

  getWss(): WebSocket.Server {
      return this.wss;
  }

  handleConnection(socket: CustomSocket, req: IncomingMessage) {
    const self = this;
    socket.on('pong', () => socket.isAlive = true)
    
    const ip = req.socket.remoteAddress;
    console.log(`${ip} has connected...`);

    //send immediatly a feedback to the incoming connection and every interval thereafter  
    this.wss.clients
        .forEach(client => {
            client.send(this.getSensorStatuses());
        });
    setInterval(() => {
        this.wss.clients
        .forEach(client => {
            client.send(this.getSensorStatuses());
        });
    }, 10000);
    
    socket.on('error', (err) => {
        console.warn(`Client disconnected - reason: ${err}`);
    });
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

  noop() {}


}