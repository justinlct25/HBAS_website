import express from 'express';
import {
  alertDataAdminRoutes,
  alertDataPostRoute,
  alertDataUserRoutes,
} from './routes/alertData.routes';
import { companiesAdminRoutes, companiesUserRoutes } from './routes/companies.routes';
import { devicesAdminRoutes, devicesUserRoutes } from './routes/devices.routes';
import { loginRoutes } from './routes/login.routes';
import { vehiclesAdminRoutes, vehiclesUserRoutes } from './routes/vehicles.routes';
import { adminIsLoggedIn, isLoggedIn } from './utils/guards';

export const routes = express.Router();

routes.use('/login', loginRoutes);

routes.use('/devices', isLoggedIn, devicesUserRoutes);
routes.use('/devices', isLoggedIn, adminIsLoggedIn, devicesAdminRoutes);

routes.use('/alert-data', isLoggedIn, alertDataUserRoutes);
routes.use('/alert-data', alertDataPostRoute);
routes.use('/alert-data', isLoggedIn, adminIsLoggedIn, alertDataAdminRoutes);

routes.use('/companies', isLoggedIn, companiesUserRoutes);
routes.use('/companies', isLoggedIn, adminIsLoggedIn, companiesAdminRoutes);

routes.use('/vehicles', isLoggedIn, vehiclesUserRoutes);
routes.use('/vehicles', isLoggedIn, adminIsLoggedIn, vehiclesAdminRoutes);
