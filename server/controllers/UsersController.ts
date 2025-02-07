import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { UsersService } from '../services/UsersService';
import { INewUser, Roles } from './../models/models';

export class UsersController {
  constructor(private usersService: UsersService) {}

  getUsers = async (req: Request, res: Response) => {
    const dataType = req.query.type;
    const perPage = req.query.rows;
    const currentPage = req.query.page;
    const searchString = req.query.search;
    const role = req.query.role;

    if (dataType === 'form')
      return res.status(httpStatusCodes.OK).json({
        data: await this.usersService.getUsersForm(
          !!searchString ? `%${String(searchString)}%` : null,
          !!role ? (String(role) as Roles) : null
        ),
      });

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

  userChecking = async (username: string, role?: string, userId?: number) => {
    // check if required info is provided
    if (!username)
      return { statusCode: httpStatusCodes.BAD_REQUEST, message: 'Missing required information.' };

    if (!!role && role !== 'ADMIN' && role !== 'USER')
      return { statusCode: httpStatusCodes.BAD_REQUEST, message: 'Invalid role.' };

    const existing = await this.usersService.checkDuplicatedUser(username);
    if (!!existing && existing.id !== userId)
      return { statusCode: httpStatusCodes.CONFLICT, message: 'User already exists.' };

    return;
  };

  addUser = async (req: Request, res: Response) => {
    const { username, email, role }: INewUser = req.body;

    const checkingRes = await this.userChecking(username, role);
    if (!!checkingRes)
      return res.status(checkingRes.statusCode).json({ message: checkingRes.message });

    // insert data
    const id = await this.usersService.addUser(username, email, role);

    // if insert failed
    if (!id || !id.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot add user.' });

    // insert successful
    return res.status(httpStatusCodes.CREATED).json({
      message: `Added 1 user successfully.`,
      id: id[0],
    });
  };

  editUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { username, email, role }: INewUser = req.body;

    const checkingRes = await this.userChecking(username, role, parseInt(userId));
    if (!!checkingRes)
      return res.status(checkingRes.statusCode).json({ message: checkingRes.message });

    const success = await this.usersService.editUser(parseInt(userId), username, email, role);

    // if update failed
    if (!success || !success.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot update user.' });

    // update successful
    return res.status(httpStatusCodes.OK).json({ message: 'Edited user successfully.' });
  };

  deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    // delete data
    const success = await this.usersService.deleteUser(parseInt(userId));

    // if delete failed
    if (!success || !success.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot delete user.' });

    // delete successful
    return res.status(httpStatusCodes.OK).json({
      message: `Deleted user successfully.`,
    });
  };

  getUserDevicesList = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const perPage = req.query.rows;
    const currentPage = req.query.page;

    // get data
    const data = await this.usersService.getUserDevicesList(
      parseInt(userId),
      !!perPage ? parseInt(String(perPage)) : 10,
      !!currentPage ? parseInt(String(currentPage)) : 1
    );
    return res.status(httpStatusCodes.OK).json(data);
  };

  getDevicesForm = async (req: Request, res: Response) => {
    const { deviceId } = req.query;
    const data = await this.usersService.getDevicesForm(
      !!deviceId ? parseInt(String(deviceId)) : null
    );
    return res.status(httpStatusCodes.OK).json({ data });
  };

  linkDeviceAndUser = async (req: Request, res: Response) => {
    const { userId, deviceIds }: { userId: number; deviceIds: number[] } = req.body;

    // check if required info is provided
    if (!userId || !deviceIds || !deviceIds.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        message: 'Missing required information.',
      });

    const id = await this.usersService.linkDeviceAndUser(userId, deviceIds);

    // if insert failed
    if (!id || !id.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot link device.' });

    // insert successful
    return res.status(httpStatusCodes.CREATED).json({ message: `Linked device successfully.`, id });
  };

  unlinkDeviceAndUser = async (req: Request, res: Response) => {
    const { userId, deviceIds }: { userId: number; deviceIds: number[] } = req.body;

    // check if required info is provided
    if (!userId || !deviceIds || !deviceIds.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        message: 'Missing required information.',
      });

    // delete data
    const success = await this.usersService.unlinkDeviceAndUser(userId, deviceIds);

    // if delete failed
    if (!success || !success.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot unlink device.' });

    // delete successful
    return res.status(httpStatusCodes.OK).json({ message: `Unlinked device successfully.` });
  };
}
