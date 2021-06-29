import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import {Server as SocketIO} from 'socket.io';
import { logger } from './utils/logger';
import cors from 'cors';
import Knex from 'knex';
import * as knexConfig from './knexfile';

//knex
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

//app
const app = express();
app.use(cors());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// info
app.use((req, res, next) => {
    logger.info(`method: [${req.method}] path: [${req.path}] params: [${JSON.stringify(req.params)}] [${JSON.stringify(req.query)}] body: [${JSON.stringify(req.body)}]`);
    next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//socket.io
const server = new http.Server(app);
const io = new SocketIO(server);
//const STATIC_CHANNELS = ['global_notifications', 'global_chat'];

io.on('connection', function(socket){
    logger.info(socket);
    socket.emit('connection', null);
});

//service
import {DataService} from './services/dataService';
const dataService = new DataService(knex);

//controller
import {DataController} from './controllers/dataController';
export const dataController = new DataController(dataService);

//route
import { dataRoutes } from './routes/dataRoute';
app.use(dataRoutes);


const PORT = process.env.PORT || 8080;
// const socketPort = 8081;
server.listen(PORT, ()=>{
    logger.info(`Socket.io listening at http://localhost:${PORT}/`);
});
// app.listen(PORT, ()=> {
//     logger.info(`listening to PORT: [${PORT}]`);
// });