import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { WalrusRepository } from '../repository/walrus';
import AuthenticationTokenMissingException from '../exceptions/http/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/http/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface';

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;
  if (authHeader) {
    const secret = process.env["WALRUS_JWT_SECRET_KEY"];
    try {
      const token = authHeader.split(' ')[1];
      console.log(`Authenticating token: ${token}`);
      const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
      const id = verificationResponse.id;
      const walrusRepository = new WalrusRepository();
      const user = walrusRepository.getUserById(id);
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