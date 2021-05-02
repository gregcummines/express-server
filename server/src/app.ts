import * as express from 'express';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import "reflect-metadata";
import {container} from "tsyringe";
import {WebSocketServer} from "./websockets/websocket-server";
import * as WebSocket from 'ws';
import * as http from 'http';
import * as cors from 'cors';
import * as path from 'path';
import * as morgan from 'morgan';

class App {
  public app: express.Application;
  public port: number;

  private wss: WebSocketServer;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.wss = container.resolve(WebSocketServer);
    
    //initialize a simple http server
    const server = http.createServer(this.app);

    //initialize the WebSocket server instance
    const wss = new WebSocket.Server({ server });
    this.wss.setWss(wss);

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }
 
  private initializeMiddlewares() {
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(cors());
    const angularDistPath: string = '../client/dist/automation';
    this.app.use(express.static(`${angularDistPath}`));
    const angularAppPath = path.resolve(`${angularDistPath}/index.html`);
    // If the request was on the root path, send the Angular app back
    this.app.get('/', (req: express.Request, res: express.Response) => { 
      console.log("Getting Angular app for path /");
      res.sendFile(angularAppPath)
    });
    this.app.get('/*', (req: express.Request, res: express.Response) => { 
      console.log("Getting Angular app for path /*");
      res.sendFile(angularAppPath)
    });
  }
 
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
 
  public listen() {
    const server = this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
    server.on('upgrade', (request, socket, head) => {
      this.wss.getWss().handleUpgrade(request, socket, head, socket => {
        this.wss.getWss().emit('connection', socket, request);
      });
    });
  }
}
 
export default App;