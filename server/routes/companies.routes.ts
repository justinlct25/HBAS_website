import express from 'express';
import { companiesController } from '../main';
import { createAsyncMiddleware } from '../utils/middleware';

export const companiesRoutes = express.Router();

companiesRoutes.get('/vehicles/:companyId', createAsyncMiddleware(companiesController.getCompanyVehicles));
