import express from 'express';
import { alertDataController } from '../main';
import { isLoggedIn } from '../utils/guards';
import { createAsyncMiddleware } from '../utils/middleware';

export const alertDataRoutes = express.Router();

alertDataRoutes.get('/', isLoggedIn, createAsyncMiddleware(alertDataController.getData));
alertDataRoutes.post('/', createAsyncMiddleware(alertDataController.postData));
alertDataRoutes.get('/latest-locations', isLoggedIn, createAsyncMiddleware(alertDataController.getLatestLocations));

// history
alertDataRoutes.get('/history/dates/:deviceId', isLoggedIn, createAsyncMiddleware(alertDataController.getDatesWithMessages));
alertDataRoutes.get('/history/:deviceId', isLoggedIn, createAsyncMiddleware(alertDataController.getHistoryByDeviceAndDate));

// battery
alertDataRoutes.get('/battery', isLoggedIn, createAsyncMiddleware(alertDataController.getLowBatteryNotifications));
alertDataRoutes.put('/battery', isLoggedIn, createAsyncMiddleware(alertDataController.updateNotificationsStatus));
