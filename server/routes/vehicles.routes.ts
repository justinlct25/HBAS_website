import express from 'express';
import { vehiclesController } from '../main';
import { createAsyncMiddleware } from '../utils/middleware';

export const vehiclesRoutes = express.Router();

vehiclesRoutes.get('/company-id/:companyId', createAsyncMiddleware(vehiclesController.getCompanyVehicles));
vehiclesRoutes.post('/company-id/:companyId', createAsyncMiddleware(vehiclesController.addVehicles));
vehiclesRoutes.put('/:vehicleId', createAsyncMiddleware(vehiclesController.editVehicle));
vehiclesRoutes.delete('/:vehicleId', createAsyncMiddleware(vehiclesController.deleteVehicle));
