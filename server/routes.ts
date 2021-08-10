import express from 'express';
import { alertDataRoutes } from './routes/alertData.routes';
import { companiesRoutes } from './routes/companies.routes';
import { devicesRoutes } from './routes/devices.routes';
import { loginRoutes } from './routes/login.routes';
import { vehiclesRoutes } from './routes/vehicles.routes';
import { isLoggedIn } from './utils/guards';

export const routes = express.Router();

routes.use('/login', loginRoutes);
routes.use('/devices', isLoggedIn, devicesRoutes);
routes.use('/alert-data', alertDataRoutes);
routes.use('/companies', isLoggedIn, companiesRoutes);
routes.use('/vehicles', isLoggedIn, vehiclesRoutes);
