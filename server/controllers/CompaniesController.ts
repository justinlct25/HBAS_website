import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { CompaniesService } from '../services/CompaniesService';

export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  getCompanyVehicles = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const data = await this.companiesService.getCompanyVehicles(parseInt(companyId));
    return res.status(httpStatusCodes.OK).json({ data });
  };
}
