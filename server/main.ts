import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { logger } from './utils/logger';
import cors from 'cors';
import Knex from 'knex';
import * as knexConfig from './knexfile';
import http from 'http';
import { Server as SocketIO, Socket } from 'socket.io';
import { attachPaginate } from 'knex-paginate';

// import services & controllers
import { LoginService } from './services/LoginService';
import { DevicesService } from './services/DevicesService';
import { CompaniesService } from './services/CompaniesService';
import { AlertDataService } from './services/AlertDataService';
import { VehiclesService } from './services/VehiclesService';
import { UsersService } from './services/UsersService';

import { LoginController } from './controllers/LoginController';
import { DevicesController } from './controllers/DevicesController';
import { CompaniesController } from './controllers/CompaniesController';
import { AlertDataController } from './controllers/AlertDataController';
import { VehiclesController } from './controllers/VehiclesController';
import { UsersController } from './controllers/UsersController';

//knex
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
attachPaginate();

//app
const app = express();

// cors
const corsOptions = {
  origin: [/localhost:\d{1,}/, process.env.CORS_ORIGIN_1 ?? '', process.env.CORS_ORIGIN_2 ?? ''],
};
app.use(cors(corsOptions));

//socket.io
const server = new http.Server(app);
export const io = new SocketIO(server, {
  cors: corsOptions,
});

//  sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.1,
  // environment
  environment: process.env.NODE_ENV,
});

// info
app.use((req, res, next) => {
  logger.info(`method: [${req.method}] path: [${req.path}]`);
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// // socket on
io.on('connection', (socket: Socket) => {
  logger.info(`socket ${socket.id} is connected`);

  socket.on('disconnect', () => {
    logger.info(`socket ${socket.id} is disconnected`);
  });
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// create services
export const loginService = new LoginService(knex);
const devicesService = new DevicesService(knex);
const companiesService = new CompaniesService(knex);
const alertDataService = new AlertDataService(knex);
const vehiclesService = new VehiclesService(knex);
const usersService = new UsersService(knex);

// create controllers
export const loginController = new LoginController(loginService);
export const devicesController = new DevicesController(devicesService);
export const companiesController = new CompaniesController(companiesService);
export const alertDataController = new AlertDataController(alertDataService, devicesService);
export const vehiclesController = new VehiclesController(vehiclesService);
export const usersController = new UsersController(usersService);

//route
import { routes } from './routes';

const API_VERSION = process.env.API_VERSION ?? '/api/v2';
app.use(API_VERSION, routes);

// The error handler must be before any other error middleware and after all controllers
app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all 404 and 500 errors
      if (error.status === 404 || error.status === 500) return true;
      return false;
    },
  })
);

// port
const PORT = process.env.PORT || 8085;

server.listen(PORT, () => {
  logger.info(`Socket listening to PORT: [${PORT}]`);
});
