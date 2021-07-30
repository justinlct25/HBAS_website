import express from 'express';
import { devicesRoutes } from './routes/devices.routes';

export const routes = express.Router();

routes.use('/devices', devicesRoutes);
