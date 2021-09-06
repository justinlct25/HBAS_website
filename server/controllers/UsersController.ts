import { Roles } from './../models/models';
import { UsersService } from '../services/UsersService';
import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

export class UsersController {
  constructor(private usersService: UsersService) {}

  getUsers = async (req: Request, res: Response) => {
    const perPage = req.query.rows;
    const currentPage = req.query.page;
    const searchString = req.query.search;
    const role = req.query.role;

    // get data
    const data = await this.usersService.getUsers(
      !!perPage ? parseInt(String(perPage)) : 10,
      !!currentPage ? parseInt(String(currentPage)) : 1,
      !!searchString ? `%${String(searchString)}%` : null,
      !!role ? (String(role) as Roles) : null
    );

    data.data.forEach((d) => {
      return !d.devicesCount
        ? (d.devicesCount = 0)
        : (d.devicesCount = parseInt(String(d.devicesCount)));
    });
    return res.status(httpStatusCodes.OK).json(data);
  };
}
