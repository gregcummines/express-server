import {singleton} from "tsyringe";
import * as WebSocket from 'ws';
import { SensorMessage } from './sensor-message';
import { readAllF, ValueWithID } from "ds18b20-raspi-typescript";
import { IncomingMessage } from "node:http";
import * as nodecron from 'node-cron';
import * as jwt from 'jsonwebtoken';
import { WalrusRepository } from '../repository/walrus';
import DataStoredInToken from "../interfaces/dataStoredInToken";
interface CustomSocket extends WebSocket {
    isAlive: boolean
}

@singleton()
export class WebSocketServer {
  constructor() {
      this.startMonitoringTemperatures();
  }

  private wss: WebSocket.Server;
  private tempSensors: ValueWithID[] = [];

  setWss(wss: WebSocket.Server) {
    const self = this;
    console.log("Setting up websocket server...");
    this.wss = wss;

    wss.on('connection', function (ws: WebSocket, req: IncomingMessage) {
        console.log(`Client connect via websocket: ${req.url}`);
        const secret = process.env["WALRUS_JWT_SECRET_KEY"];
        const token = req.url.substring(req.url.lastIndexOf('/') + 1);
        const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
        const id = verificationResponse.id;
        const walrusRepository = new WalrusRepository();
        const user = walrusRepository.getUserById(id);
        if (user) {
          ws.send(self.getSensorStatuses());
          const id = setInterval(function () {
            ws.send(self.getSensorStatuses(), function () {
              //
              // Ignore errors.
              //
            });
          }, 5000);

          ws.on('close', function () {
            console.log('stopping client interval');
            clearInterval(id);
          });
        } else {
          ws.close();
        }
      });
  }

  getWss(): WebSocket.Server {
      return this.wss;
  }

  getSensorStatuses(): string {
    let sensorMessages: SensorMessage[] = []; 
    this.tempSensors.forEach( (sensor) => {
        sensorMessages.push(new SensorMessage(sensor.id, "temp", `${sensor.t.toString()}F`, new Date()));
    });
    return JSON.stringify(sensorMessages);
  }

  startMonitoringTemperatures() {
    const cron = nodecron.schedule('*/2 * * * * *', () => {
        const tempSensors = readAllF(1, (err: string, results: ValueWithID[]) => {
            if (err) {
                console.warn(err);
            } else {
                results.forEach( (sensor) => {
                    const storedSensor = this.tempSensors.find(element => element.id === sensor.id);
                    if (storedSensor) {
                        storedSensor.t = sensor.t;
                    } else {
                        this.tempSensors.push(sensor);
                    }
                });
            }
        });
    }); 
    cron.start();
  }
}