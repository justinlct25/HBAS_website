import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { INewCompany } from '../models/models';
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

  companyChecking = async (requiredFields: (string | null | undefined)[], companyId?: number) => {
    // check if required info is provided
    if (requiredFields.some((item) => !item))
      return { statusCode: httpStatusCodes.BAD_REQUEST, message: 'Missing required information.' };

    // check duplicate
    const existingCompany = await this.companiesService.checkDuplicatedCompany(requiredFields[0]!);
    if (!!existingCompany && existingCompany.id !== companyId)
      return { statusCode: httpStatusCodes.CONFLICT, message: 'Company name already exists.' };

    return;
  };

  addCompany = async (req: Request, res: Response) => {
    const { companyName, tel, contactPerson }: INewCompany = req.body;

    const checkingRes = await this.companyChecking([companyName, tel, contactPerson]);
    if (!!checkingRes)
      return res.status(checkingRes.statusCode).json({
        message: checkingRes.message,
      });

    // insert data
    const id = await this.companiesService.addCompany(companyName, tel, contactPerson);

    // if insert failed
    if (!id || !id.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot add company.' });

    // insert successful
    return res.status(httpStatusCodes.CREATED).json({
      message: `Added 1 company successfully.`,
      id: id[0],
    });
  };

  editCompany = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const { companyName, tel, contactPerson }: INewCompany = req.body;

    const checkingRes = await this.companyChecking(
      [companyName, tel, contactPerson],
      parseInt(companyId)
    );
    if (!!checkingRes)
      return res.status(checkingRes.statusCode).json({
        message: checkingRes.message,
      });

    // update data
    const success = await this.companiesService.editCompany(
      parseInt(companyId),
      companyName,
      tel,
      contactPerson
    );

    // if update failed
    if (!success || !success.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot update company.' });

    // update successful
    return res.status(httpStatusCodes.OK).json({
      message: `Edited company successfully.`,
    });
  };

  deleteCompany = async (req: Request, res: Response) => {
    const { companyId } = req.params;

    // delete data
    const success = await this.companiesService.deleteCompany(parseInt(companyId));

    // if delete failed
    if (!success || !success.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot delete company.' });

    // delete successful
    return res.status(httpStatusCodes.OK).json({
      message: `Deleted company successfully.`,
    });
  };
}
