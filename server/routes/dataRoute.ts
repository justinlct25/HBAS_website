import express from 'express';
import { dataController } from '../main';

export const dataRoutes = express.Router();

dataRoutes.get(`/alertData`, dataController.getAlertData);
dataRoutes.post(`/alertData`, dataController.postAlertData);
dataRoutes.put(`/alertData`, dataController.putAlertData);
dataRoutes.delete(`/alertData`, dataController.deleteAlertData);
// update later
dataRoutes.get(`/history`, dataController.getHistoryData);

dataRoutes.get(`/companies`, dataController.getCompaniesData);
dataRoutes.post(`/companies`, dataController.postCompaniesData);

dataRoutes.post(`/vehicles/:id`, dataController.postVehicles);

dataRoutes.get(`/devices`, dataController.getDevicesData);

dataRoutes.post(`/vehicle_device`, dataController.postVehicleDevice); // profile add new link
dataRoutes.put(`/vehicle_device`); // profile update exist vehicle_device

dataRoutes.get(`/devices/version`, dataController.getDevicesVersion);

// dataRoutes.get(`/profile`);
dataRoutes.get(`/profile/:id`, dataController.getProfileData);
dataRoutes.get(`/allDevices`, dataController.getAllDeviceOnly);
dataRoutes.get(`/allCompanies`, dataController.getAllCompaniesOnly);
dataRoutes.get(`/batteryData`, dataController.getBatteryData);
dataRoutes.get(`/alertBatteryData`, dataController.getAllTypeData);
