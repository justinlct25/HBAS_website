import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { io } from '../main';
import { DataService } from '../services/dataService';
import { logger } from '../utils/logger';
import { base64ToHex, jsonHandler, gpsFetch } from '../utils/postDataFunc';

export class DataController {
  constructor(private dataService: DataService) {}

  // RESTful get /alertData
  getAlertData = async (req: Request, res: Response) => {
    try {
      const page: number = parseInt(String(req.query.page));
      const msgType = req.query.msgType;
      const searchType = String(req.query.searchType);
      const searchString = String(req.query.searchString);
      const LIMIT: number = 10;
      const OFFSET: number = LIMIT * (page - 1);
      let newSearchType = null;
      // check dropdown list string and replace in DB stucture.
      switch (searchType) {
        case 'Device ID':
          newSearchType = 'device_eui';
          break;
        case 'Car Plate':
          newSearchType = 'car_plate';
          break;
        case 'User':
          newSearchType = 'company_name';
          break;
        case 'Phone number':
          newSearchType = 'tel';
          break;
        case 'Location':
          newSearchType = 'address';
          break;
      }

      // if (newSearchType == '') {
        const {result, dataCount} = 
        await this.dataService.getHandBrakeData(
          OFFSET, 
          LIMIT, 
          !!msgType ? `${msgType}` : null, 
          !!newSearchType ? newSearchType : null, 
          !!searchString ? `${searchString}` : null
        );
        let totalPage = dataCount[0].count / LIMIT;
        if (totalPage > Math.floor(totalPage)) {
          totalPage = Math.ceil(totalPage);
        } else {
          totalPage = Math.floor(totalPage);
        }
        res.status(httpStatusCodes.OK).json({
          alertData: result,
          totalPage: totalPage,
          limit: LIMIT,
          message: 'handbrake data get',
        });
        return;
      // } else {
      //   const dataResult = await this.dataService.getAlertDataBySearch(
      //     OFFSET,
      //     LIMIT,
      //     newSearchType,
      //     searchString
      //   );
      //   res.status(httpStatusCodes.OK).json({
      //     alertData: dataResult,
      //     totalPage: totalPage,
      //     limit: LIMIT,
      //     message: 'handbrake data get',
      //   });
      //   return;
      // }
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };
  // RESTful post /alertData
  postAlertData = async (req: Request, res: Response) => {
    //not finish
    try {
      const queryMethod = req.query;
      const dataResult = req.body;
      //check query join / up first
      const hex_eui = base64ToHex(dataResult.devEUI);
      const deviceID = await this.dataService.getDevicesID(hex_eui);
      if (queryMethod.event != 'up') {
        if (queryMethod.event == 'join') {
          if (deviceID == undefined || deviceID == null) {
            await this.dataService.postDevices(dataResult.deviceName, dataResult.devEUI);
            res.status(httpStatusCodes.CREATED).json({ message: 'new device join the network' });
            return;
          }
          res.status(httpStatusCodes.NOT_ACCEPTABLE).json({ message: 'duplicate device join' });
          return;
        }
        res
          .status(httpStatusCodes.NOT_ACCEPTABLE)
          .json({ message: 'query is not accept to insert, return.' });
        return;
      }

      //replace json broken data
      const JsonStr = JSON.stringify(dataResult);
      const newJSON = JSON.parse(jsonHandler(JsonStr));

      //check data code is alive
      if (!newJSON.data) {
        res
          .status(httpStatusCodes.NOT_ACCEPTABLE)
          .json({ message: 'Income data is null, return.' });
        return;
      }
      //check json is undefined or good
      let jsonDate = new Date(newJSON.objectJSON[0].date).getFullYear();
      let checkDate = new Date().getFullYear();
      if (
        newJSON.objectJSON[0].date == '0-0-0' ||
        newJSON.objectJSON[0].time == '00:00:00' ||
        jsonDate !== checkDate
      ) {
        res
          .status(httpStatusCodes.NOT_ACCEPTABLE)
          .json({ message: 'Income data is not accept to insert, return.' });
        return;
      }

      // require device id
      if (deviceID == undefined || deviceID == null) {
        res.status(httpStatusCodes.NOT_ACCEPTABLE).json({ message: 'Wrong device unique code.' });
        return;
      }

      let addressJSON: string[] = [];
      let mixDateTime = `${newJSON.objectJSON[0].date}T${newJSON.objectJSON[0].time}`;
      let checkLalatitude = parseFloat(String(newJSON.objectJSON[0].latitude));
      let checkLongitude = parseFloat(String(newJSON.objectJSON[0].longitude));

      if (
        checkLalatitude >= 22.1 &&
        checkLalatitude <= 22.65 &&
        checkLongitude >= 113.75 &&
        checkLongitude <= 114.45
      ) {
        let result = await gpsFetch(checkLalatitude, checkLongitude);
        addressJSON.push(result);
      } else {
        addressJSON.push('GPS not found');
      }

      await this.dataService.postAlertData(
        deviceID.id,
        newJSON.data,
        mixDateTime,
        newJSON.objectJSON[0].latitude,
        newJSON.objectJSON[0].longitude,
        addressJSON[0],
        newJSON.objectJSON[0].battery,
        newJSON.objectJSON[0].msgtype
      );

      newJSON.objectJSON[0].msgtype == 'A'
        ? io.emit('get-new-alertData')
        : newJSON.objectJSON[0].msgtype == 'B'
        ? io.emit('get-new-batteryData')
        : io.emit('get-new-allMsgTypeData');

      res.status(httpStatusCodes.CREATED).json({ message: 'success created' });
      return;
    } catch (err) {
      logger.error(err);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  // getBatteryData = async (req: Request, res: Response) => {
  //   try {
  //     const page: number = parseInt(String(req.query.page));
  //     const LIMIT: number = 10;
  //     const OFFSET: number = LIMIT * (page - 1);
  //     const {dataResult, dataCount} = await this.dataService.getHandBrakeData(OFFSET, LIMIT, 'B');
  //     let totalPage = dataCount[0].count / LIMIT;
  //       if (totalPage > Math.floor(totalPage)) {
  //         totalPage = Math.ceil(totalPage);
  //       } else {
  //         totalPage = Math.floor(totalPage);
  //       }
  //     res.status(httpStatusCodes.OK).json({ data: dataResult, total: totalPage, message: 'get battery data' });
  //     return;
  //   } catch (err) {
  //     logger.error(err.message);
  //     res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
  //   }
  // };

  // getAllTypeData = async (req: Request, res: Response) => {
  //   try {
  //     const page: number = parseInt(String(req.query.page));
  //     const LIMIT: number = 10;
  //     const OFFSET: number = LIMIT * (page - 1);
  //     const {dataResult, dataCount} = await this.dataService.getHandBrakeData(OFFSET, LIMIT, null);
  //     let totalPage = dataCount[0].count / LIMIT;
  //       if (totalPage > Math.floor(totalPage)) {
  //         totalPage = Math.ceil(totalPage);
  //       } else {
  //         totalPage = Math.floor(totalPage);
  //       }
  //     res.status(httpStatusCodes.OK).json({ data: dataResult, total: totalPage, message: 'get all type data' });
  //     return;
  //   } catch (err) {
  //     logger.error(err.message);
  //     res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
  //   }
  // }

  getAllTypeData = async (req: Request, res: Response) => {
    try {
      const page: number = parseInt(String(req.query.page));
      const LIMIT: number = 10;
      const OFFSET: number = LIMIT * (page - 1);
      const result = await this.dataService.getAllMsgTypeData(OFFSET, LIMIT);
      res.status(httpStatusCodes.OK).json({ data: result, message: 'get all type data' });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  deleteCompanies = async (req: Request, res: Response) => {
    try {
      const idArray: number[] = req.body;
      const tableName = 'companies';

      const result: number[] = await this.dataService.deleteCompanies(idArray);
      const result2: number[] = await this.dataService.deleteCompanyVehicles(result, tableName);
      const result3: number[] = await this.dataService.deleteVehicles(result2);
      await this.dataService.deleteVehicleDevice(result3, tableName);

      res.status(httpStatusCodes.OK).json({ message: `Records deleted` });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  deleteVehicles = async (req: Request, res: Response) => {
    try {
      const idArray: number[] = req.body;
      const tableName: string = 'vehicles';

      const result: number[] = await this.dataService.deleteVehicles(idArray);
      await this.dataService.deleteCompanyVehicles(result, tableName);
      await this.dataService.deleteVehicleDevice(result, tableName);

      res.status(httpStatusCodes.OK).json({ message: `Vehicle Records deleted` });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };
  // 20210803
  deleteDevices = async (req: Request, res: Response) => {
    try {
      const idArray: number[] = req.body;
      const tableName: string = 'devices';

      const result: number[] = await this.dataService.deleteDevices(idArray);
      await this.dataService.deleteVehicleDevice(result, tableName);

      res.status(httpStatusCodes.OK).json({ message: 'Device records deleted' });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };
}
