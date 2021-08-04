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
      const searchType = String(req.query.searchType);
      const searchString = String(req.query.searchString);
      const LIMIT: number = 10;
      const OFFSET: number = LIMIT * (page - 1);
      let newSearchType = '';
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
        default:
          break;
      }
      const counting =
        newSearchType === ''
          ? await this.dataService.getCountingAlertData()
          : await this.dataService.getCountingAlertDataBySearch(newSearchType, searchString);
      let totalPage = parseInt(String(counting[0].count)) / LIMIT;
      if (totalPage > Math.floor(totalPage)) {
        totalPage = Math.ceil(totalPage);
      } else {
        totalPage = Math.floor(totalPage);
      }
      if (newSearchType == '') {
        const dataResult = await this.dataService.getAlertData(OFFSET, LIMIT);
        res.status(httpStatusCodes.OK).json({
          alertData: dataResult,
          totalPage: totalPage,
          limit: LIMIT,
          message: 'handbrake data get',
        });
        return;
      } else {
        const dataResult = await this.dataService.getAlertDataBySearch(
          OFFSET,
          LIMIT,
          newSearchType,
          searchString
        );
        res.status(httpStatusCodes.OK).json({
          alertData: dataResult,
          totalPage: totalPage,
          limit: LIMIT,
          message: 'handbrake data get',
        });
        return;
      }
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

  // post /companies
  postCompaniesData = async (req: Request, res: Response) => {
    try {
      const mBody = req.body;
      if (!mBody[0].companyName || !mBody[0].tel) {
        res
          .status(httpStatusCodes.BAD_REQUEST)
          .json({ message: 'Blank columns is found, please press valid input.' });
        return;
      }
      let duplicateCompany: string[] = [];
      let checkDuplicate = await this.dataService.checkCompanyDuplicate(mBody[0].companyName);
      if (checkDuplicate.length > 0) {
        duplicateCompany.push(mBody[0].companyName);
        res
          .status(httpStatusCodes.BAD_REQUEST)
          .json({ data: duplicateCompany, message: 'Duplicate company found' });
        return;
      }
      const companiesResult: number = await this.dataService.postCompaniesData(
        mBody[0].companyName,
        mBody[0].contactPerson,
        mBody[0].tel
      );

      res
        .status(httpStatusCodes.CREATED)
        .json({ data: companiesResult[0], message: 'company created' });
      return;
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ formInput: false, message: 'Internal server error!' });
    }
  };

  //post vehicles
  postVehicles = async (req: Request, res: Response) => {
    try {
      const mBody = req.body;
      const companyID: number = parseInt(String(req.params.id));
      let vehiclesArray: number[] = [];
      let vehiclesResult: number;
      let duplicateResult: string[] = [];
      let blankResult: number = 0;
      if (mBody.length > 0) {
        for (let i = 0; i < mBody.length; i++) {
          if (mBody[i].carPlate === '') {
            ++blankResult;
          } else {
            let checkDuplicate = await this.dataService.checkCarPlateDuplicate(mBody[i].carPlate);
            if (checkDuplicate.length > 0) {
              duplicateResult.push(mBody[i].carPlate);
            } else {
              vehiclesResult = await this.dataService.postVehicles(
                mBody[i].carPlate,
                mBody[i].vehicleType,
                mBody[i].vehicleModel
              );
              vehiclesArray.push(vehiclesResult);
            }
          }
        }
        if (vehiclesArray.length > 0) {
          for (let i = 0; i < vehiclesArray.length; i++) {
            await this.dataService.postCompanyVehicles(companyID, vehiclesArray[i][0]);
          }
        }
      }
      if (duplicateResult.length > 0 || blankResult > 0) {
        res.status(httpStatusCodes.OK).json({
          data: duplicateResult,
          blank: blankResult,
          message: `Success insert: ${vehiclesArray.length}, 
            Duplicate car plate: ${duplicateResult.length}, 
            Empty car plate: ${blankResult}
            `,
        });
      } else {
        res
          .status(httpStatusCodes.CREATED)
          .json({ data: [], blank: 0, message: 'Vehicles created successful' });
      }
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  getBatteryData = async (req: Request, res: Response) => {
    try {
      const page: number = parseInt(String(req.query.page));
      const LIMIT: number = 10;
      const OFFSET: number = LIMIT * (page - 1);
      const result = await this.dataService.getBatteryData(OFFSET, LIMIT);
      res.status(httpStatusCodes.OK).json({ data: result, message: 'get battery data' });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

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
  // 20210802 edit / delete companies & vehicles
  putCompanies = async (req: Request, res: Response) => {
    try {
      const { id, company_name, tel, contact_person } : { 
        id: number, 
        company_name: string, 
        tel: string, 
        contact_person: string
      } = req.body;
      if (!company_name || !tel) {
        res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Emtpy company name or tel' });
        return;
      }
      if (tel.length !== 8) {
        res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'tel is invalid length' });
        return;
      }
      const duplicate = await this.dataService.checkCompanyDuplicate(company_name);
      if (duplicate.length > 0) {
        if (duplicate[0].id === id) {
        } else {
          res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'company name is duplicate' });
          return;
        }
      }
      const result = await this.dataService.putCompanies(id, company_name, tel, contact_person);

  //     res.status(httpStatusCodes.OK).json({ data: result, message: 'company detail updated' });
  //     return;
  //   } catch (err) {
  //     logger.error(err.message);
  //     res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
  //   }
  // };
  deleteCompanies = async (req: Request, res: Response) => {
    try {
      const { idArray }: { idArray: number[] } = req.body;
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
  // putVehicles = async (req: Request, res: Response) => {
  //   try {
  //     const {
  //       id,
  //       car_plate,
  //       vehicle_model,
  //       vehicle_type,
  //     }: {
  //       id: number;
  //       car_plate: string;
  //       vehicle_model: string;
  //       vehicle_type: string;
  //     } = req.body;
  //     if (!car_plate) {
  //       res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Empty car plate detected' });
  //       return;
  //     }
  //     if (car_plate.length > 8) {
  //       res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'car plate length invalid' });
  //       return;
  //     }
  //     const duplicate = await this.dataService.checkCarPlateDuplicate(car_plate);
  //     if (duplicate.length > 0) {
  //       if (duplicate[0].id === id) {
  //       } else {
  //         res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'car plate is duplicate' });
  //         return;
  //       }
  //     }
  //     const result = await this.dataService.putVehicles(
  //       id,
  //       car_plate.toUpperCase(),
  //       vehicle_model,
  //       vehicle_type
  //     );

  //     res.status(httpStatusCodes.OK).json({ data: result, message: 'vehicle detail updated' });
  //     return;
  //   } catch (err) {
  //     logger.error(err.message);
  //     res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
  //   }
  // };
  deleteVehicles = async (req: Request, res: Response) => {
    try {
      const { idArray }: { idArray: number[] } = req.body;
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
      const { idArray }: { idArray: number[] } = req.body;
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
