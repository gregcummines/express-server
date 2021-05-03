import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

function authenticateJWT(req: any, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, 'THIS IS A SAMPLE SECRET', (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }

          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

export default authenticateJWT;