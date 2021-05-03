import * as express from 'express';
import { authenticateJWT } from 'middleware/auth.middleware';
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
      this.router.get(this.path, authenticateJWT, this.getAll);
      this.router.post(`${this.path}/authenticate`, this.authenticate);
    }

    getAll = (request: express.Request, 
            response: express.Response, 
            next: express.NextFunction) => {
        this.usersService.getAll()
        .then(users => response.json(users))
        .catch(next);
    } 

    authenticate = (request: express.Request, 
                    response: express.Response, 
                    next: express.NextFunction) => {
        this.usersService.authenticate(request.body)
        .then(user => response.json(user))
        .catch(next);
    }
    
}  