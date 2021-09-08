import express from 'express';
import { usersController } from '../main';
import { createAsyncMiddleware } from '../utils/middleware';

export const userDevicesRoutes = express.Router();

// for linking users and devices
userDevicesRoutes.get('/devices', createAsyncMiddleware(usersController.getDevicesForm));
userDevicesRoutes.post('/', createAsyncMiddleware(usersController.linkDeviceAndUser));
