import express from 'express';
import { companiesController } from '../main';
import { createAsyncMiddleware } from '../utils/middleware';

export const companiesUserRoutes = express.Router();
export const companiesAdminRoutes = express.Router();

// get apis
companiesUserRoutes.get('/', createAsyncMiddleware(companiesController.getCompaniesInfo));
companiesUserRoutes.get('/:companyId', createAsyncMiddleware(companiesController.getCompanyDetails));

// other apis
companiesAdminRoutes.post('/', createAsyncMiddleware(companiesController.addCompany));
companiesAdminRoutes.put('/:companyId', createAsyncMiddleware(companiesController.editCompany));
companiesAdminRoutes.delete('/:companyId', createAsyncMiddleware(companiesController.deleteCompany));
