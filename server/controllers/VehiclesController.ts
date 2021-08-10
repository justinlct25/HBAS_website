import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { INewVehicle } from '../models/models';
import { VehiclesService } from '../services/VehiclesService';

export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  getCompanyVehicles = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const data = await this.vehiclesService.getCompanyVehicles(parseInt(companyId));
    return res.status(httpStatusCodes.OK).json({ data });
  };

  vehicleChecking = async (vehicles: INewVehicle[], vehicleId?: number) => {
    // check if required info is provided
    if (!vehicles || !vehicles.length || vehicles.some((item) => !item.carPlate))
      return { statusCode: httpStatusCodes.BAD_REQUEST, message: 'Missing required information.' };

    // check duplicates
    const existingVehicles = await this.vehiclesService.checkExistingVehicles(
      vehicles.map((v) => v.carPlate)
    );
    if (!!existingVehicles && existingVehicles.length > 0 && existingVehicles[0].id !== vehicleId)
      return {
        statusCode: httpStatusCodes.CONFLICT,
        message: 'Vehicle already exists.',
        existingCarPlates: existingVehicles.map((v) => v.car_plate),
      };

    if (vehicles.some((v) => v.carPlate.length > 8))
      return {
        statusCode: httpStatusCodes.BAD_REQUEST,
        message: 'Car plate length should not exceed 8 characters.',
      };

    return;
  };

  addVehicles = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const { vehicles }: { vehicles: INewVehicle[] } = req.body;

    const checkingRes = await this.vehicleChecking(vehicles);
    if (!!checkingRes)
      return res.status(checkingRes.statusCode).json({
        message: checkingRes.message,
        existingCarPlates: checkingRes.existingCarPlates ?? [],
      });

    // insert data
    const ids = await this.vehiclesService.addVehicles(vehicles, parseInt(companyId));

    // if insert failed
    if (!ids || !ids.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot add vehicles.' });

    // insert successful
    return res.status(httpStatusCodes.CREATED).json({
      message: `Added ${ids.length} ${ids.length > 1 ? 'vehicles' : 'vehicle'} successfully.`,
      ids,
    });
  };

  editVehicle = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    const { carPlate, vehicleModel, vehicleType, manufactureYear }: INewVehicle = req.body;

    const checkingRes = await this.vehicleChecking(
      [{ carPlate, vehicleModel, vehicleType, manufactureYear }],
      parseInt(vehicleId)
    );

    if (!!checkingRes)
      return res.status(checkingRes.statusCode).json({
        message: checkingRes.message,
        existingCarPlates: checkingRes.existingCarPlates ?? [],
      });

    // update data
    const success = await this.vehiclesService.editVehicle(
      parseInt(vehicleId),
      carPlate,
      vehicleModel,
      vehicleType,
      manufactureYear
    );

    // if update failed
    if (!success || !success.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot update vehicle.' });

    // update successful
    return res.status(httpStatusCodes.OK).json({
      message: `Edited vehicle successfully.`,
    });
  };

  deleteVehicle = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;

    // delete data
    const success = await this.vehiclesService.deleteVehicle(parseInt(vehicleId));

    // if delete failed
    if (!success || !success.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot delete vehicle.' });

    // delete successful
    return res.status(httpStatusCodes.OK).json({
      message: `Deleted vehicle successfully.`,
    });
  };
}
