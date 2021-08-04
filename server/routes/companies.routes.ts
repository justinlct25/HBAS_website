import express from 'express';
import { companiesController } from '../main';
import { createAsyncMiddleware } from '../utils/middleware';

export const companiesRoutes = express.Router();

// get apis
companiesRoutes.get('/', createAsyncMiddleware(companiesController.getCompaniesInfo));
companiesRoutes.get('/:companyId', createAsyncMiddleware(companiesController.getCompanyDetails));
companiesRoutes.get('/vehicles/:companyId', createAsyncMiddleware(companiesController.getCompanyVehicles));

// other apis
companiesRoutes.post('/', createAsyncMiddleware(companiesController.addCompany));
