import express from 'express';
import { dataController } from '../main';

export const dataRoutes = express.Router();

dataRoutes.get(`/alertData`, dataController.getAlertData);
dataRoutes.post(`/alertData`, dataController.postAlertData);

dataRoutes.delete(`/devices`, dataController.deleteDevices);

// dataRoutes.get(`/batteryData`, dataController.getBatteryData);
// dataRoutes.get(`/alertBatteryData`, dataController.getAllTypeData);
