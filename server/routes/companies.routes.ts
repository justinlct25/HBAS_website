import express from 'express';
import { companiesController } from '../main';
import { createAsyncMiddleware } from '../utils/middleware';

export const companiesRoutes = express.Router();

// get apis
companiesRoutes.get('/', createAsyncMiddleware(companiesController.getCompaniesInfo));
companiesRoutes.get('/:companyId', createAsyncMiddleware(companiesController.getCompanyDetails));

// other apis
companiesRoutes.post('/', createAsyncMiddleware(companiesController.addCompany));
companiesRoutes.put('/:companyId', createAsyncMiddleware(companiesController.editCompany));
companiesRoutes.delete('/:companyId', createAsyncMiddleware(companiesController.deleteCompany));
