import { DataService } from '../services/dataService';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import httpStatusCodes from 'http-status-codes';

export class DataController {
  constructor(private dataService: DataService) {}

  getAlertData = async (req: Request, res: Response) => {
    try {
      const page = req.query;
      const newPage = parseInt(String(page.page));
      const LIMIT: number = 7;

      const OFFSET: number = LIMIT * (newPage - 1);
      const counting = await this.dataService.getCountingData();
      let totalPage = parseInt(String(counting[0].count)) / LIMIT;
      if (totalPage > Math.floor(totalPage)) {
        totalPage = Math.ceil(totalPage);
      } else {
        totalPage = Math.floor(totalPage);
      }
      const dataResult = await this.dataService.getAlertData(OFFSET, LIMIT);

      res.status(httpStatusCodes.OK).json({
        alertData: dataResult,
        totalPage: totalPage,
        limit: LIMIT,
        message: 'handbrake data get',
      });
      //logger.info('res json data');
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  postAlertData = async (req: Request, res: Response) => {
    //not finish
    try {
      const queryMethod = req.query;
      const dataResult = req.body;
      //check query join / up first
      if (queryMethod.event != 'up') {
        res
          .status(httpStatusCodes.NOT_ACCEPTABLE)
          .json({ message: 'query is not accept to insert, return.' });
        return;
      }

      //replace json broken data
      let JsonStr = JSON.stringify(dataResult);
      JsonStr = JsonStr.replace(/\"\[\{/gi, `\[\{`);
      JsonStr = JsonStr.replace(/\'\[\{/gi, `\[\{`);
      JsonStr = JsonStr.replace(/\}\]\"/gi, `\}\]`);
      JsonStr = JsonStr.replace(/\}\]\'/gi, `\}\]`);
      JsonStr = JsonStr.replace(/\}\]\"/gi, `\}\]`);
      JsonStr = JsonStr.replace(/\\\"/gi, `\"`);
      const newJSON = JSON.parse(JsonStr);

      //check data code is alive
      if (!newJSON.data) {
        res
          .status(httpStatusCodes.NOT_ACCEPTABLE)
          .json({ message: 'Income data is null, return.' });
        return;
      }
      //check json is undefined or good
      if (
        newJSON.objectJSON[0].date == '0-0-0' ||
        newJSON.objectJSON[0].latitude == '0' ||
        newJSON.objectJSON[0].longitude == '0' ||
        newJSON.objectJSON[0].time == '00:00:00'
      ) {
        res
          .status(httpStatusCodes.NOT_ACCEPTABLE)
          .json({ message: 'Income data is not accept to insert, return.' });
        return;
      }
      //check handbrake is sending real data
      // if(newJSON.data && newJSON.objectJSON[0].msgtype != 'A'){
      //     res.status(httpStatusCodes.NOT_ACCEPTABLE).json({message:'handbrake type is not A.'});
      //     return;
      // }
      // require device id
      const deviceID = await this.dataService.getDevicesID(newJSON.deviceName, newJSON.devEUI);
      if (deviceID == undefined || deviceID == null) {
        res.status(httpStatusCodes.NOT_ACCEPTABLE).json({ message: 'Wrong device unique code.' });
        return;
      }

      await this.dataService.postAlertData(
        deviceID.id,
        newJSON.data,
        newJSON.objectJSON[0].date,
        newJSON.objectJSON[0].time,
        newJSON.objectJSON[0].latitude,
        newJSON.objectJSON[0].longitude,
        newJSON.objectJSON[0].battery
      );

      res.status(httpStatusCodes.CREATED).json({ message: 'success created' });
      return;
    } catch (err) {
      logger.error(err);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  putAlertData = async (req: Request, res: Response) => {
    try {
      await this.dataService.putAlertData();

      res.status(httpStatusCodes.ACCEPTED).json({ message: 'update data' });
    } catch (err) {
      logger.error(err);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  deleteAlertData = async (req: Request, res: Response) => {
    try {
      await this.dataService.deleteAlertData();

      res.status(httpStatusCodes.ACCEPTED).json({ message: 'record is delete' });
    } catch (err) {
      logger.error(err);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  // RESTful get /history
  getHistoryData = async (req: Request, res: Response) => {
    try {
      await this.dataService.getUserGroupingData('');
      res.status(httpStatusCodes.OK).json({ message: 'test' });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  // RESTful get /companies
  getCompaniesData = async (req: Request, res: Response) => {
    try {
      const companyResult = await this.dataService.getCompaniesData();
      res
        .status(httpStatusCodes.OK)
        .json({ companies: companyResult, message: 'get company data' });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  // RESTful get /devices
  getDevicesData = async (req: Request, res: Response) => {
    try {
      const devicesResult = await this.dataService.getDevicesData();
      res.status(httpStatusCodes.OK).json({ devices: devicesResult, message: 'get devices data' });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  getDevicesVersion = async (req: Request, res: Response) => {
    try {
      const ver = req.query;
      console.log(ver);
      const newVer = String(ver);
      console.log(newVer);
      const verData = await this.dataService.getDevicesVersion(newVer);
      console.log(verData);
      res.status(httpStatusCodes.ACCEPTED).json({version: verData[0], message: 'get version data'})
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  }
}
