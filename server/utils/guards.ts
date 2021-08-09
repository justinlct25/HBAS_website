import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import jwtSimple from 'jwt-simple';
import { Bearer } from 'permit';
import { loginService } from '../main';
import jwt from './jwt';
import { logger } from './logger';

const permit = new Bearer({
  query: 'access_token',
});

export async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  try {
    const token = permit.check(req);

    if (!token) {
      return res.status(httpStatusCodes.UNAUTHORIZED).json({
        message: 'Unauthorized access.',
      });
    }

    const payload = jwtSimple.decode(token, jwt.jwtSecret);
    const user = await loginService.getUser(payload.username);

    if (!user) {
      return res.status(httpStatusCodes.UNAUTHORIZED).json({
        message: 'Unauthorized access.',
      });
    }

    return next();
  } catch (err) {
    logger.error(err.message);
    return res.status(httpStatusCodes.UNAUTHORIZED).json({
      message: 'Unauthorized access.',
    });
  }
}
