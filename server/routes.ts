import express from 'express';
import { alertDataRoutes } from './routes/alertData.routes';
import { companiesRoutes } from './routes/companies.routes';
import { devicesRoutes } from './routes/devices.routes';

export const routes = express.Router();

routes.use('/devices', devicesRoutes);
routes.use('/companies', companiesRoutes);
routes.use('/alert-data', alertDataRoutes);
