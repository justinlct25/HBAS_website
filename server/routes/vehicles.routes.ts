import express from 'express';
import { vehiclesController } from '../main';
import { createAsyncMiddleware as CAM } from '../utils/middleware';

export const vehiclesUserRoutes = express.Router();
export const vehiclesAdminRoutes = express.Router();

vehiclesUserRoutes.get('/company-id/:companyId', CAM(vehiclesController.getCompanyVehicles));
vehiclesAdminRoutes.post('/company-id/:companyId', CAM(vehiclesController.addVehicles));
vehiclesAdminRoutes.put('/:vehicleId', CAM(vehiclesController.editVehicle));
vehiclesAdminRoutes.delete('/:vehicleId', CAM(vehiclesController.deleteVehicle));
