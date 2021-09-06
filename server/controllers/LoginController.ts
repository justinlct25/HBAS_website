import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import jwtSimple from 'jwt-simple';
import { LoginService } from '../services/LoginService';
import { checkPassword } from '../utils/hash';
import jwt from '../utils/jwt';
import { logger } from '../utils/logger';

export class LoginController {
  constructor(private loginService: LoginService) {}

  login = async (req: Request, res: Response) => {
    try {
      const { email, password }: { email: string; password: string } = req.body;
      if (!email || !password) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          message: 'Missing required information.',
        });
      }

      const user = await this.loginService.getUser(email);
      if (!user || !(await checkPassword(password, user.password))) {
        return res.status(httpStatusCodes.UNAUTHORIZED).json({
          message: 'Invalid email or password.',
        });
      }

      const { id, role } = user;
      const payload = { id, email: user.email, role, exp: Date.now() / 1000 + 43200 };

      const token = jwtSimple.encode(payload, jwt.jwtSecret);
      return res.status(httpStatusCodes.OK).json({ token, id, role });
    } catch (err) {
      logger.error(err);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error.',
      });
    }
  };
}
