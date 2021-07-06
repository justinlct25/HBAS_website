import express from 'express';
import { dataController } from '../main';

export const dataRoutes = express.Router();

dataRoutes.get(`/alertData`, dataController.getAlertData);
dataRoutes.post(`/alertData`, dataController.postAlertData);
dataRoutes.put(`/alertData`, dataController.putAlertData);
dataRoutes.delete(`/alertData`, dataController.deleteAlertData);
// update later