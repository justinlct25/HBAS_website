import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { logger } from './utils/logger';
import cors from 'cors';
import Knex from 'knex';
import * as knexConfig from './knexfile';

//knex
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

//app
const app = express();
app.use(cors());


// info
app.use((req, res, next) => {
    logger.info(`method: [${req.method}] path: [${req.path}]`);
    next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


import {DataService} from './services/dataService';
const dataService = new DataService(knex);

//controller
import {DataController} from './controllers/dataController';
export const dataController = new DataController(dataService);

//route
import { dataRoutes } from './routes/dataRoute';
app.use(dataRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=> {
    logger.info(`listening to PORT: [${PORT}]`);
});