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
      this.router.post(`${this.path}/authenticate`, this.authenticate);
    }

    getAll = (request: express.Request, 
            response: express.Response, 
            next: express.NextFunction) => {
        return this.usersService.getAll()
    } 

    authenticate = (request: express.Request, 
                    response: express.Response, 
                    next: express.NextFunction) => {
        return this.usersService.authenticate(request.body);
    }
    
}  