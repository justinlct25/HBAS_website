import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { AlertDataService } from '../services/AlertDataService';

export class AlertDataController {
  constructor(private alertDataService: AlertDataService) {}

  getLatestLocations = async (req: Request, res: Response) => {
    const data = await this.alertDataService.getLatestLocations();
    return res.status(httpStatusCodes.OK).json({ data });
  };

  getDatesWithMessages = async (req: Request, res: Response) => {
    const { deviceId } = req.params;
    const data = await this.alertDataService.getDatesWithMessages(parseInt(deviceId));
    return res.status(httpStatusCodes.OK).json({ data });
  };

  getHistoryByDeviceAndDate = async (req: Request, res: Response) => {
    const { deviceId } = req.params;
    const { date } = req.query;
    const data = await this.alertDataService.getHistoryByDeviceAndDate(
      parseInt(deviceId),
      !!date ? String(date) : null
    );
    return res.status(httpStatusCodes.OK).json({ data });
  };
}
