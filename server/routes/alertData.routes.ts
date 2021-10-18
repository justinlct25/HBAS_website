import express from 'express';
import { alertDataController as CON } from '../main';
import { createAsyncMiddleware as CAM } from '../utils/middleware';

export const alertDataUserRoutes = express.Router();
export const alertDataPostRoute = express.Router();
export const alertDataAdminRoutes = express.Router();

alertDataUserRoutes.get('/', CAM(CON.getData));
alertDataPostRoute.post('/', CAM(CON.postData));
alertDataUserRoutes.get('/latest-locations', CAM(CON.getLatestLocations));

// history
alertDataUserRoutes.get('/history/dates/:deviceId', CAM(CON.getDatesWithMessages));
alertDataUserRoutes.get('/history/:deviceId', CAM(CON.getHistoryByDeviceAndDate));

// battery
alertDataUserRoutes.get('/battery', CAM(CON.getLowBatteryNotifications));
alertDataAdminRoutes.put('/battery', CAM(CON.updateNotificationsStatus));
