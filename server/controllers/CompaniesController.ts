import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { INewCompany, INewVehicle } from '../models/models';
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

  addCompany = async (req: Request, res: Response) => {
    const { companyName, tel, contactPerson }: INewCompany = req.body;

    // check if required info is provided
    if (!companyName || !tel)
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        message: 'Missing required information.',
      });

    // check duplicate
    const existingCompany = await this.companiesService.checkDuplicatedCompany(companyName);
    if (!!existingCompany)
      return res.status(httpStatusCodes.CONFLICT).json({
        message: 'Company name already exists.',
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

    // check if required info is provided
    if (!companyName || !tel)
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        message: 'Missing required information.',
      });

    // check duplicate
    const existingCompany = await this.companiesService.checkDuplicatedCompany(companyName);
    if (!!existingCompany && existingCompany.id !== parseInt(companyId))
      return res.status(httpStatusCodes.CONFLICT).json({
        message: 'Company name already exists.',
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

  addVehicles = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const { vehicles }: { vehicles: INewVehicle[] } = req.body;

    // check if required info is provided
    if (!vehicles || !vehicles.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        message: 'Missing required information.',
      });

    vehicles.forEach((v) => (v.carPlate = v.carPlate.toUpperCase()));

    // check duplicates
    const existingVehicles = await this.companiesService.checkExistingVehicles(
      vehicles.map((v) => v.carPlate)
    );
    if (!!existingVehicles && existingVehicles.length > 0)
      return res.status(httpStatusCodes.CONFLICT).json({
        message: 'Company name already exists.',
        existingCarPlates: existingVehicles.map((v) => v.car_plate),
      });

    // insert data
    const ids = await this.companiesService.addVehicles(vehicles, parseInt(companyId));

    // if insert failed
    if (!ids || !ids.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot add vehicles.' });

    // insert successful
    return res.status(httpStatusCodes.CREATED).json({
      message: `Added ${ids.length} ${ids.length > 1 ? 'vehicles' : 'vehicle'} successfully.`,
      ids,
    });
  };
}
