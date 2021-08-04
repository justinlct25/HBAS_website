import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { CompaniesService } from '../services/CompaniesService';

export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  // get one company details
  getCompanyDetails = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const data = await this.companiesService.getCompanyDetails(parseInt(companyId));
    return res.status(httpStatusCodes.OK).json({ data });
  };

  // get all companies' list
  getCompaniesInfo = async (req: Request, res: Response) => {
    const perPage = req.query.rows;
    const currentPage = req.query.page;
    const searchString = req.query.search;

    // get data
    const data = await this.companiesService.getCompaniesInfo(
      !!perPage ? parseInt(String(perPage)) : 10,
      !!currentPage ? parseInt(String(currentPage)) : 1,
      !!searchString ? `%${String(searchString)}%` : null
    );
    data.data.forEach((d) => {
      return !d.vehiclesCount
        ? (d.vehiclesCount = 0)
        : (d.vehiclesCount = parseInt(String(d.vehiclesCount)));
    });
    return res.status(httpStatusCodes.OK).json(data);
  };

  getCompanyVehicles = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const data = await this.companiesService.getCompanyVehicles(parseInt(companyId));
    return res.status(httpStatusCodes.OK).json({ data });
  };
}
