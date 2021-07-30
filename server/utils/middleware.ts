import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { logger } from './logger';

export const createAsyncMiddleware = (fn: any) => (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error(err.message);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
    });
  });
