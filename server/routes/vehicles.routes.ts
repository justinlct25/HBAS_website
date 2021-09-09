import express from 'express';
import { vehiclesController } from '../main';
import { createAsyncMiddleware as CAM } from '../utils/middleware';

export const vehiclesRoutes = express.Router();

vehiclesRoutes.get('/company-id/:companyId', CAM(vehiclesController.getCompanyVehicles));
vehiclesRoutes.post('/company-id/:companyId', CAM(vehiclesController.addVehicles));
vehiclesRoutes.put('/:vehicleId', CAM(vehiclesController.editVehicle));
vehiclesRoutes.delete('/:vehicleId', CAM(vehiclesController.deleteVehicle));
