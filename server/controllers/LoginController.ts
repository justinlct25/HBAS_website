import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import jwtSimple from 'jwt-simple';
import { LoginService } from '../services/LoginService';
import { checkPassword, hashPassword } from '../utils/hash';
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
      if (!user.info || !(await checkPassword(password, user.info.password))) {
        return res.status(httpStatusCodes.UNAUTHORIZED).json({
          message: 'Invalid email or password.',
        });
      }

      const { id, role } = user.info;
      const payload = {
        id,
        email: user.info.email,
        role,
        devices: user.devices,
        exp: Date.now() / 1000 + 43200,
      };

      const token = jwtSimple.encode(payload, jwt.jwtSecret);
      return res.status(httpStatusCodes.OK).json({ token, id, role, devices: user.devices });
    } catch (err) {
      logger.error(err);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error.',
      });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { oldPassword, newPassword }: { oldPassword: string; newPassword: string } = req.body;

    // check if required info is provided
    if (!userId || !oldPassword || !newPassword)
      return res
        .status(httpStatusCodes.BAD_REQUEST)
        .json({ message: 'Missing required information.' });

    const currentPassword = await this.loginService.checkPassword(userId);
    if (!currentPassword || !(await checkPassword(oldPassword, currentPassword.password)))
      return res.status(httpStatusCodes.UNAUTHORIZED).json({ message: 'Incorrect password.' });

    const changePasswordSuccess = await this.loginService.changePassword(
      userId,
      await hashPassword(String(newPassword))
    );

    if (!changePasswordSuccess)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot change password.' });

    return res.status(httpStatusCodes.OK).json({ message: 'Changed password successfully.' });
  };
}
