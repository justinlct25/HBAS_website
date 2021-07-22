import express from 'express';
import { dataController } from '../main';

export const dataRoutes = express.Router();

dataRoutes.get(`/alertData`, dataController.getAlertData);
dataRoutes.post(`/alertData`, dataController.postAlertData);
dataRoutes.put(`/alertData`, dataController.putAlertData);
dataRoutes.delete(`/alertData`, dataController.deleteAlertData);
// update later
dataRoutes.get(`/history`, dataController.getHistoryData);
dataRoutes.post(`/history`);
dataRoutes.put(`/history`);
dataRoutes.delete(`/history`);

dataRoutes.get(`/companies`, dataController.getCompaniesData);
dataRoutes.post(`/companies`, dataController.postCompaniesData);
dataRoutes.put(`/companies`);
dataRoutes.delete(`/companies`);

dataRoutes.get(`/devices`, dataController.getDevicesData);
dataRoutes.post(`/devices`);
dataRoutes.put(`/devices`);
dataRoutes.delete(`/devices`);

dataRoutes.get(`/devices/version`, dataController.getDevicesVersion);
dataRoutes.post(`/devices/version`);
dataRoutes.put(`/devices/version`);
dataRoutes.delete(`/devices/version`);

dataRoutes.get(`/profile`);
dataRoutes.get(`/profile/:id`, dataController.getProfileData);