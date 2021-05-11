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
import * as compression from 'compression';
class App {
  public app: express.Application;
  public port: number;

  private readonly angularDistPath: string = '../client/dist/automation';

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
    this.initializeAngularHookup();
    this.initializeErrorHandling();
  }
 
  private initializeMiddlewares() {
    let compressionOptions: compression.CompressionOptions = {
      filter: shouldCompress
    };
    this.app.use(compression(compressionOptions));
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.static(`${this.angularDistPath}`));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      console.log(`Setting up path for controller route: ${controller.path}`);
      this.app.use('/', controller.router);
    });
  }
 
  private initializeAngularHookup() {
    const angularAppPath = path.resolve(`${this.angularDistPath}/index.html`);
    // If the request was on the root path, send the Angular app back
    this.app.get('/', (req: express.Request, res: express.Response) => { 
      console.log("Getting Angular app for path /");
      res.sendFile(angularAppPath);
    });
    this.app.get('/*', (req: express.Request, res: express.Response) => { 
      console.log("Getting Angular app for path /*");
      res.sendFile(angularAppPath);
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

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
 
  // fallback to standard filter function
  return compression.filter(req, res)
}

export default App;