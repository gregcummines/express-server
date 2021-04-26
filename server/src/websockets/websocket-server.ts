import {singleton} from "tsyringe";
import * as WebSocket from 'ws';
import { SensorMessage } from './sensor-message';
import { readAllF } from "ds18b20-raspi-typescript";
import { IncomingMessage } from "node:http";

interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}

@singleton()
export class WebSocketServer {
  constructor() {
  }

  private wss: WebSocket.Server;

  setWss(wss: WebSocket.Server) {
    console.log("Setting up websocket server...");
    this.wss = wss;

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        const ip = req.socket.remoteAddress;
        console.log(`${ip} has connected...`);

        const extWs = ws as ExtWebSocket;
    
        extWs.isAlive = true;
    
        ws.on('pong', () => {
            extWs.isAlive = true;
        });
    
        //send immediatly a feedback to the incoming connection and every interval thereafter  
        ws.send(this.getSensorStatuses()); 
        setInterval(() => {
            this.wss.clients
                .forEach(client => {
                    client.send(this.getSensorStatuses());
                });
        }, 10000);
        
        ws.on('error', (err) => {
            console.warn(`Client disconnected - reason: ${err}`);
        })
    });
    
    setInterval(() => {
        this.wss.clients.forEach((ws: WebSocket) => {
    
            const extWs = ws as ExtWebSocket;
    
            if (!extWs.isAlive) return ws.terminate();
    
            extWs.isAlive = false;
            ws.ping(null, undefined);
        });
    }, 10000);
  }

  getSensorStatuses(): string {
    let sensorMessages: SensorMessage[] = []; 
    let tempSensors = readAllF(1);
    tempSensors.forEach( (sensor) => {
        sensorMessages.push(new SensorMessage(sensor.id, sensor.t.toString()));
    });
    return JSON.stringify(sensorMessages);
  }
}