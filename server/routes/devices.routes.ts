import express from 'express';
import { devicesController } from '../main';
import { createAsyncMiddleware as CAM } from '../utils/middleware';

export const devicesUserRoutes = express.Router();
export const devicesAdminRoutes = express.Router();

devicesUserRoutes.get('/', CAM(devicesController.getAllDevices));
devicesUserRoutes.get('/link-device-vehicle', CAM(devicesController.getDevicesForLinking));
devicesAdminRoutes.post('/link-device-vehicle', CAM(devicesController.linkDeviceAndVehicle));
