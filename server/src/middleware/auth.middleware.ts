import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface';

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;
  const users: any = [{ id: 1, username: 'test@gmail.com', password: 'test', firstName: 'Test', lastName: 'User' }];
  if (authHeader) {
    const secret = 'THIS IS A SAMPLE SECRET'; //process.env.JWT_SECRET;
    try {
      const token = authHeader.split(' ')[1];
      console.log(`Authenticating token: ${token}`);
      const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
      const id = verificationResponse.id;
      const user = await users.find(element => element.id === id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;