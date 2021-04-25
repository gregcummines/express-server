import {singleton} from "tsyringe";
import * as WebSocket from 'ws';
import { Message } from './message';
import { readAllF } from "ds18b20-raspi-typescript";

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

    this.wss.on('connection', (ws: WebSocket) => {

        const extWs = ws as ExtWebSocket;
    
        extWs.isAlive = true;
    
        ws.on('pong', () => {
            extWs.isAlive = true;
        });
    
        //connection is up, let's add a simple simple event
        ws.on('message', (msg: string) => {
    
            const message = JSON.parse(msg) as Message;
            console.log(message);
            setTimeout(() => {
                if (message.isBroadcast) {
                    //send back the message to the other clients
                    this.wss.clients
                        .forEach(client => {
                            if (client != ws) {
                                client.send(this.createMessage(message.content, true, message.sender));
                            }
                        });
    
                }
    
                ws.send(this.createMessage(`You sent -> ${message.content}`, message.isBroadcast));
    
            }, 1000);
    
        });
    
        //send immediatly a feedback to the incoming connection and every interval thereafter  
        ws.send(this.createMessage(readAllF(1)[0].t.toString())); 
        setInterval(() => {
            console.log('sending temp');
            ws.send(this.createMessage(readAllF(1)[0].t.toString()));
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

  createMessage(content: string, isBroadcast = false, sender = 'NS'): string {
    return JSON.stringify(new Message(content, isBroadcast, sender));
  }

  sendStatusUpdate(status: string) {

  }
}