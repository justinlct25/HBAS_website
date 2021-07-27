import { DataService } from '../services/dataService';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import httpStatusCodes from 'http-status-codes';
import { io } from '../main';
import fetch from 'node-fetch';

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
        case 'Date':
          newSearchType = 'date';
          break;
        default:
          break;
      }
      const counting =
        newSearchType === ''
          ? await this.dataService.getCountingAlertData() : 
        newSearchType === 'date'
          ? await this.dataService.getAlertDataBySearchDate(1,1,'','')//// push
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
      const deviceID = await this.dataService.getDevicesID(dataResult.deviceName, dataResult.devEUI);
      if (queryMethod.event != 'up') {
        if(queryMethod.event == 'join'){
          if (deviceID == undefined || deviceID == null) {
            await this.dataService.postDevices(dataResult.deviceName, dataResult.devEUI);
            res.status(httpStatusCodes.CREATED).json({ message: 'new device join the network' });
            return;
          }
          res.status(httpStatusCodes.NOT_ACCEPTABLE).json({message:'duplicate device join'});
          return;
        }
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
      // newJSON.objectJSON[0].latitude == '0' ||
      // newJSON.objectJSON[0].longitude == '0' ||
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

      let addressJSON:string[] = [];
      let mixDateTime = `${newJSON.objectJSON[0].date}T${newJSON.objectJSON[0].time}`;
      let checkLalatitude = parseFloat(String(newJSON.objectJSON[0].latitude));
      let checkLongitude = parseFloat(String(newJSON.objectJSON[0].longitude));
      console.log(newJSON.objectJSON[0].latitude + ' ' + newJSON.objectJSON[0].longitude);
      console.log(typeof(checkLalatitude) + ' ' +checkLalatitude + ' ' + typeof(checkLongitude) + ' ' + checkLongitude);
      if(checkLalatitude >= 22.1 && checkLalatitude <= 22.65 && checkLongitude >= 113.75 && checkLongitude <= 114.45){
        await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${newJSON.objectJSON[0].latitude}&lon=${newJSON.objectJSON[0].longitude}&format=json&zoom=16`
        ).then(response => response.json())
        .then(data => {
          (data.address.county)? addressJSON.push(JSON.stringify(data.address.county).replace(/\ /,`++`).split('++')[1].replace(/\"/,``)) : 
          (data.address.city_district)? addressJSON.push(JSON.stringify(data.address.city_district).replace(/\ /,`++`).split('++')[1].replace(/\"/,``)) : 
          (data.address.quarter)? addressJSON.push(JSON.stringify(data.address.quarter).replace(/\ /,`++`).split('++')[1].replace(/\"/,``)) : 
          (data.address.suburb)? addressJSON.push(JSON.stringify(data.address.suburb).replace(/\ /,`++`).split('++')[1].replace(/\"/,``)) : 
          addressJSON.push('GPS not found');
        });
      }else{
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

      (newJSON.objectJSON[0].msgtype == 'A')?
      io.emit('get-new-alertData'):
      (newJSON.objectJSON[0].msgtype == 'B')?
      io.emit('get-new-batteryData'): 
      io.emit('get-new-allMsgTypeData');

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
      const mBody = req.body;

      const companiesResult: number = await this.dataService.postCompaniesData(
        mBody[0].companyName,
        mBody[0].contactPerson,
        mBody[0].tel
      );

      // io.emit('get-new-companies');
      res.status(httpStatusCodes.CREATED).json({data: companiesResult[0], message: 'company created' });
      return;
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ formInput: false, message: 'Internal server error!' });
    }
  };
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
      totalPage > Math.floor(totalPage)
        ? (totalPage = Math.ceil(totalPage))
        : (totalPage = Math.floor(totalPage));

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
  //post vehicles
  postVehicles = async(req: Request, res: Response)=>{
    try {
      const mBody = req.body;
      console.log(JSON.stringify(req.params.id));
      const companyID:number = parseInt(String(req.params.id));
      let vehiclesArray: number[] = [];
      if(mBody.length > 0){
        for (let i = 0; i < mBody.length; i++) {
          let vehiclesResult: number = await this.dataService.postVehicles(
            mBody[i].carPlate,
            mBody[i].vehicleType,
            mBody[i].vehicleModel
          );
          vehiclesArray.push(vehiclesResult);
        }
        for (let i = 0; i < vehiclesArray.length; i++) {
          await this.dataService.postCompanyVehicles(companyID, vehiclesArray[i][0]);
        }
      }
      res.status(httpStatusCodes.CREATED).json({message:'Vehicles created'});
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  }

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
  // get profile data
  getProfileData = async (req: Request, res: Response) => {
    try {
      const companyID = req.params;
      console.log(JSON.stringify(companyID));
      const result = await this.dataService.getProfileByID(parseInt(String(companyID.id)))
      res.status(httpStatusCodes.OK).json({data: result, message: 'test'});
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!'});
    }
  };
  // get all devices only
  getAllDeviceOnly = async(req:Request, res: Response)=>{
    try {
      const result = await this.dataService.getAllDevices();
      res.status(httpStatusCodes.OK).json({data: result, message: 'get all devices data'});
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!'});
    }
  }
}
