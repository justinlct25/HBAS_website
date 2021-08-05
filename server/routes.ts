import express from 'express';
import { alertDataRoutes } from './routes/alertData.routes';
import { companiesRoutes } from './routes/companies.routes';
import { devicesRoutes } from './routes/devices.routes';
import { vehiclesRoutes } from './routes/vehicles.routes';

export const routes = express.Router();

routes.use('/devices', devicesRoutes);
routes.use('/alert-data', alertDataRoutes);
routes.use('/companies', companiesRoutes);
routes.use('/vehicles', vehiclesRoutes);
