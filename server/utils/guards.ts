import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import jwtSimple from 'jwt-simple';
import { Bearer } from 'permit';
import { loginService } from '../main';
import jwt from './jwt';
import { logger } from './logger';

const permit = new Bearer({ query: 'access_token' });
const authFailedRes = { message: 'Unauthorized access.' };

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = permit.check(req);
    if (!token) return res.status(httpStatusCodes.UNAUTHORIZED).json(authFailedRes);

    const payload = jwtSimple.decode(token, jwt.jwtSecret);
    const user = await loginService.getUser(payload.email);
    if (!user.info) return res.status(httpStatusCodes.UNAUTHORIZED).json(authFailedRes);

    const { password, ...others } = user.info;
    req.user = { ...others, devices: user.devices };
    return next();
  } catch (err) {
    logger.error(err.message);
    return res.status(httpStatusCodes.UNAUTHORIZED).json(authFailedRes);
  }
};

export const adminIsLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN')
      return res.status(httpStatusCodes.UNAUTHORIZED).json(authFailedRes);
    return next();
  } catch (err) {
    logger.error(err.message);
    return res.status(httpStatusCodes.UNAUTHORIZED).json(authFailedRes);
  }
};
