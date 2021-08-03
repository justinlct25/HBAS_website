import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import * as gpsFetch from 'node-fetch';
import { io } from '../main';
import { DataService } from '../services/dataService';
import { logger } from '../utils/logger';
import { base64ToHex } from '../utils/eui_decoder';
import console from 'console';

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
          ? await this.dataService.getCountingAlertData()
          : newSearchType === 'date'
          ? await this.dataService.getAlertDataBySearchDate(1, 1, '', '') //// push
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
        await gpsFetch
          .default(
            `https://nominatim.openstreetmap.org/reverse?lat=${newJSON.objectJSON[0].latitude}&lon=${newJSON.objectJSON[0].longitude}&format=json&zoom=16`
          )
          .then((response: any) => response.json())
          .then((data: any) => {
            data.address.county
              ? addressJSON.push(
                  JSON.stringify(data.address.county)
                    .replace(/\ /, `++`)
                    .split('++')[1]
                    .replace(/\"/, ``)
                )
              : data.address.city_district
              ? addressJSON.push(
                  JSON.stringify(data.address.city_district)
                    .replace(/\ /, `++`)
                    .split('++')[1]
                    .replace(/\"/, ``)
                )
              : data.address.quarter
              ? addressJSON.push(
                  JSON.stringify(data.address.quarter)
                    .replace(/\ /, `++`)
                    .split('++')[1]
                    .replace(/\"/, ``)
                )
              : data.address.suburb
              ? addressJSON.push(
                  JSON.stringify(data.address.suburb)
                    .replace(/\ /, `++`)
                    .split('++')[1]
                    .replace(/\"/, ``)
                )
              : addressJSON.push('GPS not found');
          });
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
      const OFFSET: number = LIMIT * (page - 1) || 0;
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

      let totalPage = parseInt(String(counting.length)) / LIMIT;
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
        companies: companyResult.rows,
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
      if (mBody[0].companyName === '' || mBody[0].tel === '') {
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

      // io.emit('get-new-companies');
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
  // put devices
  putDevices = async (req: Request, res: Response) => {
    try {
      // const mBody = req.body;
      // await this.dataService.putDevices();
      res.status(httpStatusCodes.ACCEPTED).json({ message: '' });
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
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

  // check meter's version to update
  getDevicesVersion = async (req: Request, res: Response) => {
    try {
      const ver = req.query;
      // console.log(ver);
      const newVer = String(ver);
      // console.log(newVer);
      const verData = await this.dataService.getDevicesVersion(newVer);
      // console.log(verData);
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
      const result = await this.dataService.getProfileByID(parseInt(String(companyID.id)));
      console.log(result);
      res.status(httpStatusCodes.OK).json({ data: result, message: 'test' });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };
  // post vehicle_device
  postVehicleDevice = async (req: Request, res: Response) => {
    try {
      const mBody = req.body;
      let checkResult = await this.dataService.getVehicleDevice(mBody.vehicleID, mBody.deviceID);
      if (checkResult === undefined || checkResult === null) {
        // insert new link
        await this.dataService.postVehicleDevice(mBody.vehicleID, mBody.deviceID);
      } else {
        // set first data 'is_active' to be false
        await this.dataService.putVehicleDevice(checkResult.vehicle_device_id);
        // set devices 'is_register' to be false
        await this.dataService.putDevices(checkResult.device_id);
        // insert new link
        await this.dataService.postVehicleDevice(mBody.vehicleID, mBody.deviceID);
      }
      res.status(httpStatusCodes.CREATED).json({ message: 'vehicle & device link created' });
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };
  // get all devices only, company name & car plate
  getAllDeviceOnly = async (req: Request, res: Response) => {
    try {
      const result = await this.dataService.getAllDevices();
      res.status(httpStatusCodes.OK).json({ data: result, message: 'get all devices data' });
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  };

  // get all companies only, car plate & device eui
  getAllCompaniesOnly = async (req: Request, res: Response) => {
    try {
      const result = await this.dataService.getCompaniesByDevicePage();
      res.status(httpStatusCodes.OK).json({
        data: result,
        count: result.length,
        message: 'get all companies & belong their vehicles',
      });
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
      const { id, company_name, tel, contact_person } = req.body;
      if(company_name === null || 
        company_name === undefined || 
        tel === null || 
        tel === undefined){
          res.status(httpStatusCodes.BAD_REQUEST).json({message: 'Emtpy company name or tel'});
          return;
      }
      if(tel.length !== 8){
        res.status(httpStatusCodes.BAD_REQUEST).json({message: 'tel is invalid length'});
        return;
      }
      const duplicate = await this.dataService.checkCompanyDuplicate(company_name);
      if(duplicate.length > 0){
        if(duplicate[0].id === id){}else{
          res.status(httpStatusCodes.BAD_REQUEST).json({message: 'company name is duplicate'});
          return;
        }
      }
      const result = await this.dataService.putCompanies(id, company_name, tel, contact_person);

      res.status(httpStatusCodes.OK).json({data: result, message: 'company detail updated'});
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  }
  deleteCompanies = async (req: Request, res: Response) => {
    try {
      const idArray:{id:number}[] = req.body;
      const tableName = 'companies';
      let putArray:number[] = [];

      for(let i = 0; i < idArray.length; i++) {
        putArray.push(idArray[i].id);
      }

      const result: number[] = await this.dataService.deleteCompanies(putArray);
      const result2: number[] = await this.dataService.deleteCompanyVehicles(result, tableName);
      const result3: number[] = await this.dataService.deleteVehicles(result2);
      await this.dataService.deleteVehicleDevice(result3, tableName);

      res.status(httpStatusCodes.OK).json({ message:`Records deleted`});
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  }
  putVehicles = async (req: Request, res: Response) => {
    try {
      const { id, car_plate, vehicle_model, vehicle_type }:
      {
        id:number, 
        car_plate:string, 
        vehicle_model:string, 
        vehicle_type:string
      } = req.body;
      if(car_plate === undefined || car_plate === null){
        res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Empty car plate detected'});
        return;
      }
      if(car_plate.length > 8){
        res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'car plate length invalid'});
        return;
      }
      const duplicate = await this.dataService.checkCarPlateDuplicate(car_plate);
      if(duplicate.length > 0){
        if(duplicate[0].id === id){}else{
          res.status(httpStatusCodes.BAD_REQUEST).json({message: 'car plate is duplicate'});
          return;
        }
      }
      const result = await this.dataService.putVehicles(id, (car_plate.toUpperCase()), vehicle_model, vehicle_type);

      res.status(httpStatusCodes.OK).json({data: result, message: 'vehicle detail updated'});
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  }
  deleteVehicles = async (req: Request, res: Response) => {
    try {
      const idArray:{id: number}[] = req.body;
      const tableName:string = 'vehicles'; 
      let putArray:number[] = [];
      for(let i = 0; i < idArray.length; i++) {
        putArray.push(idArray[i].id);
      }

      const result: number[] = await this.dataService.deleteVehicles(putArray);
      await this.dataService.deleteCompanyVehicles(result, tableName);
      await this.dataService.deleteVehicleDevice(result, tableName);

      res.status(httpStatusCodes.OK).json({ message:`Vehicle Records deleted`});
      return;
    } catch (err) {
      logger.error(err.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error!' });
    }
  }
}
