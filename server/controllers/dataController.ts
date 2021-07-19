import { DataService } from '../services/dataService';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import httpStatusCodes from 'http-status-codes';

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
          newSearchType = 'geolocation';
          break;
        case 'Date':
          newSearchType = 'date';
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
      if(newJSON.data && newJSON.objectJSON[0].msgtype != 'A'){
          res.status(httpStatusCodes.NOT_ACCEPTABLE).json({message:'handbrake type is not A.'});
          return;
      }
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

      logger.info(JSON.stringify(newJSON));
      res.status(httpStatusCodes.CREATED).json({ message: 'success created' });
      return;
    } catch (err) {
      logger.error(err);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };
  // RESTful put /alertData
  putAlertData = async (req: Request, res: Response) => {
    try {
      await this.dataService.putAlertData();

      res.status(httpStatusCodes.ACCEPTED).json({ message: 'update data' });
    } catch (err) {
      logger.error(err);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };
  // RESTful delete /alertData
  deleteAlertData = async (req: Request, res: Response) => {
    try {
      await this.dataService.deleteAlertData();

      res.status(httpStatusCodes.ACCEPTED).json({ message: 'record is delete' });
    } catch (err) {
      logger.error(err);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };
  // get /history
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
  // get /companies
  getCompaniesData = async (req: Request, res: Response) => {
    try {
      const page: number = parseInt(String(req.query.page));
      const searchType = String(req.query.searchType);
      const searchString = String(req.query.searchString);
      const LIMIT: number = 10;
      const OFFSET: number = LIMIT * (page - 1);
      let newSearchType = '';
      let sqlLike = 'ILIKE';
      let newSearchString: string | number = searchString;
      switch (searchType) {
        case 'Company Name':
          newSearchType = 'company_name';
          newSearchString = `%${newSearchString}%`;
          break;
        case 'Contact Person':
          newSearchType = 'contact_person';
          newSearchString = `%${newSearchString}%`;
          break;
        case 'Phone Number':
          newSearchType = 'tel';
          newSearchString = `%${newSearchString}%`;
          break;
        case 'Number of Vehicles':
          newSearchType = 'count(company_vehicles.company_id)';
          sqlLike = '=';
          newSearchString = parseInt(newSearchString);
          break;
        default:
          break;
      }

      const counting =
        newSearchType === ''
          ? await this.dataService.getCountingCompanies()
          : await this.dataService.getCountingCompaniesBySearch(
              newSearchType,
              newSearchString,
              sqlLike
            );

      let totalPage =
        newSearchType === ''
          ? parseInt(String(counting[0].count)) / LIMIT
          : parseInt(String(counting.length)) / LIMIT;
      totalPage > Math.floor(totalPage)
        ? (totalPage = Math.ceil(totalPage))
        : (totalPage = Math.floor(totalPage));

      let companyResult;
      newSearchType === ''
        ? (companyResult = await this.dataService.getCompaniesData(OFFSET, LIMIT))
        : searchType !== 'Number of Vehicles'
        ? (companyResult = await this.dataService.getCompaniesDataBySearch(
            OFFSET,
            LIMIT,
            newSearchType,
            newSearchString
          ))
        : (companyResult = await this.dataService.getCompaniesDataNumberBySearch(
            OFFSET,
            LIMIT,
            newSearchString
          ));
      res.status(httpStatusCodes.OK).json({
        companies: companyResult,
        totalPage: totalPage,
        limit: LIMIT,
        message: 'get company data',
      });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };
  // post /companies
  postCompaniesData = async (req: Request, res: Response) => {
    try {
      // const mQuery = req.query;
      const mBody = req.body;
      let vehiclesArray:number[] = [];
      // console.log('mQuery' + JSON.stringify(mQuery));
      // console.log('mBody' + JSON.stringify(mBody));
      // console.log(mBody[0]);
      const companiesResult:number = await this.dataService
        .postCompaniesData(mBody[0].companyName, mBody[0].contactPerson, mBody[0].tel);
      for(let i = 1; i < mBody.length; i++) {
        let vehiclesResult:number = await this.dataService
          .postVehicles(mBody[i].carPlate, mBody[i].vehicleType, mBody[i].vehicleModel);
        vehiclesArray.push(vehiclesResult);
      }
      for(let i = 0; i < vehiclesArray.length; i++) {
        await this.dataService
          .postCompanyVehicles(companiesResult[0], vehiclesArray[i][0]);
      }

      res.status(httpStatusCodes.CREATED).json({ message: 'record created' })
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({formInput: false, message: 'Internal server error!' });
    }
  }
  // get /devices
  getDevicesData = async (req: Request, res: Response) => {
    try {
      const page: number = parseInt(String(req.query.page));
      const searchType = String(req.query.searchType);
      const searchString = String(req.query.searchString);
      const LIMIT: number = 10;
      const OFFSET: number = LIMIT * (page - 1);
      let newSearchType = '';
      switch (searchType) {
        case 'Device ID':
          newSearchType = `devices.device_eui`;
          break;
        case 'Device Name':
          newSearchType = `devices.device_name`;
          break;
        case 'User':
          newSearchType = `companies.company_name`;
          break;
        case 'Phone number':
          newSearchType = `companies.tel`;
          break;
        default:
          break;
      }
      const counting =
        newSearchType === ''
          ? await this.dataService.getCountingDevices()
          : await this.dataService.getCountingDevicesBySearch(newSearchType, searchString);
      let totalPage = parseInt(String(counting[0].count)) / LIMIT;
      (totalPage > Math.floor(totalPage)) ? totalPage = Math.ceil(totalPage) : totalPage = Math.floor(totalPage);

      let devicesResult;
      if (newSearchType === '') {
        devicesResult = await this.dataService.getDevicesData(OFFSET, LIMIT);
      } else {
        devicesResult = await this.dataService.getDevicesDataBySearch(
          OFFSET,
          LIMIT,
          newSearchType,
          searchString
        );
      }
      res.status(httpStatusCodes.OK).json({
        devices: devicesResult,
        totalPage: totalPage,
        limit: LIMIT,
        message: 'get devices data',
      });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };
  // check meter's version to update
  getDevicesVersion = async (req: Request, res: Response) => {
    try {
      const ver = req.query;
      console.log(ver);
      const newVer = String(ver);
      console.log(newVer);
      const verData = await this.dataService.getDevicesVersion(newVer);
      console.log(verData);
      res
        .status(httpStatusCodes.ACCEPTED)
        .json({ version: verData[0], message: 'get version data' });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };
}
