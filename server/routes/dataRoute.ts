import express from 'express';
import { dataController } from '../main';

export const dataRoutes = express.Router();

dataRoutes.get(`/alertData`, dataController.getAlertData);
dataRoutes.post(`/alertData`, dataController.postAlertData);

dataRoutes.post(`/companies`, dataController.postCompaniesData);
dataRoutes.put(`/companies`, dataController.putCompanies);
dataRoutes.delete(`/companies`, dataController.deleteCompanies);

dataRoutes.post(`/vehicles/:id`, dataController.postVehicles);
dataRoutes.put(`/vehicles`, dataController.putVehicles);
dataRoutes.delete(`/vehicles`, dataController.deleteVehicles);

dataRoutes.delete(`/devices`, dataController.deleteDevices);

dataRoutes.get(`/batteryData`, dataController.getBatteryData);
dataRoutes.get(`/alertBatteryData`, dataController.getAllTypeData);
