import express from 'express';
import {
  alertDataAdminRoutes,
  alertDataPostRoute,
  alertDataUserRoutes,
} from './routes/alertData.routes';
import { companiesRoutes } from './routes/companies.routes';
import { devicesAdminRoutes, devicesUserRoutes } from './routes/devices.routes';
import { loginRoutes } from './routes/login.routes';
import { userDevicesRoutes } from './routes/userDevices.routes';
import { usersRoutes } from './routes/users.routes';
import { vehiclesRoutes } from './routes/vehicles.routes';
import { adminIsLoggedIn, isLoggedIn } from './utils/guards';

export const routes = express.Router();

routes.use('/login', loginRoutes);

routes.use('/users', isLoggedIn, adminIsLoggedIn, usersRoutes);
routes.use('/user-devices', isLoggedIn, adminIsLoggedIn, userDevicesRoutes);

routes.use('/devices', isLoggedIn, devicesUserRoutes);
routes.use('/devices', isLoggedIn, adminIsLoggedIn, devicesAdminRoutes);

routes.use('/alert-data', isLoggedIn, alertDataUserRoutes);
routes.use('/alert-data', alertDataPostRoute);
routes.use('/alert-data', isLoggedIn, adminIsLoggedIn, alertDataAdminRoutes);

routes.use('/companies', isLoggedIn, adminIsLoggedIn, companiesRoutes);

routes.use('/vehicles', isLoggedIn, adminIsLoggedIn, vehiclesRoutes);
