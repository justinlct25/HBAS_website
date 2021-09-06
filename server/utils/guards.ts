import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import jwtSimple from 'jwt-simple';
import { Bearer } from 'permit';
import { loginService } from '../main';
import jwt from './jwt';
import { logger } from './logger';

const permit = new Bearer({ query: 'access_token' });

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const authFailedRes = res.status(httpStatusCodes.UNAUTHORIZED).json({
    message: 'Unauthorized access.',
  });
  try {
    const token = permit.check(req);
    if (!token) return authFailedRes;

    const payload = jwtSimple.decode(token, jwt.jwtSecret);
    const user = await loginService.getUser(payload.email);
    if (!user) return authFailedRes;

    const { password, ...others } = user;
    req.user = { ...others };
    return next();
  } catch (err) {
    logger.error(err.message);
    return authFailedRes;
  }
};

export const adminIsLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const authFailedRes = res.status(httpStatusCodes.UNAUTHORIZED).json({
    message: 'Unauthorized access.',
  });
  try {
    if (!req.user || req.user.role !== 'ADMIN') return authFailedRes;
    return next();
  } catch (err) {
    logger.error(err.message);
    return authFailedRes;
  }
};
