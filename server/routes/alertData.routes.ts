import express from 'express';
import { alertDataController } from '../main';
import { createAsyncMiddleware } from '../utils/middleware';

export const alertDataRoutes = express.Router();

alertDataRoutes.get('/latest-locations', createAsyncMiddleware(alertDataController.getLatestLocations));
