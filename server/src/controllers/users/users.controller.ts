import * as express from 'express';
import authMiddleware from '../../middleware/auth.middleware';
import Controller from '../../interfaces/controller.interface';
import { UsersService } from './users.service';
export class UsersController implements Controller {
    private usersService: UsersService = new UsersService();
    
    public path = '/users';
    public router = express.Router();

    constructor() {
      this.intializeRoutes();
    }
   
    public intializeRoutes() {
      this.router.get(this.path, authMiddleware, this.getAll);
      this.router.post(`${this.path}/register`, this.register);
      this.router.post(`${this.path}/authenticate`, this.authenticate);
    }

    getAll = (request: express.Request, 
            response: express.Response, 
            next: express.NextFunction) => {
      const users = this.usersService.getAll();  
      response.send(users);
    } 

    register = (request: express.Request, 
              response: express.Response, 
              next: express.NextFunction) => {
      let userWithToken = null;
      try {
        userWithToken = this.usersService.register(request.body);
      } catch(error) {
        console.log(error);
        response.status(401).send('Invalid login credentials');
      }
      response.send(userWithToken);    
    }

    authenticate = (request: express.Request, 
                    response: express.Response, 
                    next: express.NextFunction) => {
      let userWithToken = null;
      try {
        userWithToken = this.usersService.authenticate(request.body);
      } catch(error) {
        response.status(401).send('Invalid login credentials');
      }
      response.send(userWithToken); 
    }
    
}  