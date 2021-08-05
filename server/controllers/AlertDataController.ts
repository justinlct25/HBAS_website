import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { msgType } from '../models/models';
import { AlertDataService } from '../services/AlertDataService';

export class AlertDataController {
  constructor(private alertDataService: AlertDataService) {}

  getData = async (req: Request, res: Response) => {
    const msgType = req.params.msgType.toUpperCase() as msgType;
    const perPage = req.query.rows;
    const currentPage = req.query.page;
    const searchString = req.query.search;
    const startDate = req.query.from;
    const endDate = req.query.to;

    // get data
    const data = await this.alertDataService.getData(
      msgType,
      !!perPage ? parseInt(String(perPage)) : 20,
      !!currentPage ? parseInt(String(currentPage)) : 1,
      !!searchString ? `%${String(searchString)}%` : null,
      !!startDate ? String(startDate) : null,
      !!endDate ? String(endDate) : null
    );
    return res.status(httpStatusCodes.OK).json(data);
  };

  getLatestLocations = async (req: Request, res: Response) => {
    const data = await this.alertDataService.getLatestLocations();
    return res.status(httpStatusCodes.OK).json({ data });
  };

  getDatesWithMessages = async (req: Request, res: Response) => {
    const { deviceId } = req.params;
    const data = await this.alertDataService.getDatesWithMessages(parseInt(deviceId));
    data.forEach((d) => (d.messageCount = parseInt(String(d.messageCount))));
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
