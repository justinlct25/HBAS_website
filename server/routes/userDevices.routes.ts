import express from 'express';
import { usersController } from '../main';
import { createAsyncMiddleware } from '../utils/middleware';

export const userDevicesRoutes = express.Router();

// for linking users and devices
userDevicesRoutes.get('/:userId', createAsyncMiddleware(usersController.getUserDevicesList));
userDevicesRoutes.get('/', createAsyncMiddleware(usersController.getDevicesForm));
userDevicesRoutes.post('/', createAsyncMiddleware(usersController.linkDeviceAndUser));
userDevicesRoutes.put('/', createAsyncMiddleware(usersController.unlinkDeviceAndUser));
