import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { AlertDataService } from '../services/AlertDataService';

export class AlertDataController {
  constructor(private alertDataService: AlertDataService) {}

  getLatestLocations = async (req: Request, res: Response) => {
    const data = await this.alertDataService.getLatestLocations();
    return res.status(httpStatusCodes.OK).json({ data });
  };
}
