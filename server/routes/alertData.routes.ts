import express from 'express';
import { alertDataController } from '../main';
import { createAsyncMiddleware } from '../utils/middleware';

export const alertDataRoutes = express.Router();

alertDataRoutes.get('/', createAsyncMiddleware(alertDataController.getData));
alertDataRoutes.post('/', createAsyncMiddleware(alertDataController.postData));
alertDataRoutes.get('/latest-locations', createAsyncMiddleware(alertDataController.getLatestLocations));

// history
alertDataRoutes.get('/history/dates/:deviceId', createAsyncMiddleware(alertDataController.getDatesWithMessages));
alertDataRoutes.get('/history/:deviceId', createAsyncMiddleware(alertDataController.getHistoryByDeviceAndDate));
