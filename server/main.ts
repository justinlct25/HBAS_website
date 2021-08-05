import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { logger } from './utils/logger';
import cors from 'cors';
import Knex from 'knex';
import * as knexConfig from './knexfile';
import http from 'http';
import { Server as SocketIO, Socket } from 'socket.io';
import { attachPaginate } from 'knex-paginate';

// import services & controllers
import { DataService } from './services/dataService';
import { DevicesService } from './services/DevicesService';
import { CompaniesService } from './services/CompaniesService';
import { AlertDataService } from './services/AlertDataService';

import { DataController } from './controllers/dataController';
import { DevicesController } from './controllers/DevicesController';
import { CompaniesController } from './controllers/CompaniesController';
import { AlertDataController } from './controllers/AlertDataController';

//knex
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
attachPaginate();

//app
const app = express();
app.use(cors());

//socket.io
const server = new http.Server(app);
export const io = new SocketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
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

// create services
const dataService = new DataService(knex);
const devicesService = new DevicesService(knex);
const companiesService = new CompaniesService(knex);
const alertDataService = new AlertDataService(knex);

// create controllers
export const dataController = new DataController(dataService);
export const devicesController = new DevicesController(devicesService);
export const companiesController = new CompaniesController(companiesService);
export const alertDataController = new AlertDataController(alertDataService);

//route
import { dataRoutes } from './routes/dataRoute';
import { routes } from './routes';
app.use('/api/v1', dataRoutes);
app.use('/api/v2', routes);

const PORT = process.env.PORT || 8085;

server.listen(PORT, () => {
  logger.info(`Socket listening to PORT: [${PORT}]`);
});
