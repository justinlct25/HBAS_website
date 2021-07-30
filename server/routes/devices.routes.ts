import express from 'express';
import { devicesController } from '../main';
import { createAsyncMiddleware } from '../utils/middleware';

export const devicesRoutes = express.Router();

devicesRoutes.post('/link-device-vehicle', createAsyncMiddleware(devicesController.linkDeviceAndVehicle));
