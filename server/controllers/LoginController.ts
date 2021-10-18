import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import jwtSimple from 'jwt-simple';
import { LoginService } from '../services/LoginService';
import jwt from '../utils/jwt';
import { logger } from '../utils/logger';

export class LoginController {
  constructor(private loginService: LoginService) {}

  login = async (req: Request, res: Response) => {
    try {
      if (!req.body.username || !req.body.password) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          message: 'Missing required information.',
        });
      }

      const { username, password }: { username: string; password: string } = req.body;
      const user = await this.loginService.getUser(username);
      if (!user || password !== user.password) {
        return res.status(httpStatusCodes.UNAUTHORIZED).json({
          message: 'Invalid username or password.',
        });
      }

      const payload = { username: user.username };
      const token = jwtSimple.encode(
        {
          ...payload,
          exp: Date.now() / 1000 + 43200, // 12 hours
        },
        jwt.jwtSecret
      );

      return res.status(httpStatusCodes.OK).json({ token: token });
    } catch (err) {
      logger.error(err);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error.',
      });
    }
  };
}
