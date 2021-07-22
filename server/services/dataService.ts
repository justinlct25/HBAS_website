import * as Knex from 'knex';

export class DataService {
    constructor(private knex:Knex){}
    // RESTful get /alertData, get all data in database
    async getAlertData(offset:number, limit:number):Promise<any>{
        return await this.knex
        .select('alert_data.id', 'devices.device_name', 'devices.device_eui', `alert_data.date`, 
            'alert_data.time', 'alert_data.geolocation', 'alert_data.battery', 'alert_data.address', 
            'companies.company_name', 'companies.tel', 'companies.contact_person', 'alert_data.created_at', 
            'vehicles.car_plate', 'vehicles.vehicle_model', 'vehicle_type', 'alert_data.msgType')
            .from('alert_data')
            .leftJoin('devices', 'devices.id', 'alert_data.device_id')
            .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
            .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
            .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
            .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
            .where({'companies.is_active': true, 'devices.is_active': true, 'alert_data.is_active': true
                    , 'vehicles.is_active':true, 'company_vehicles.is_active': true, 'vehicle_device.is_active': true
                    ,'alert_data.msgType':'A'})
            .orderBy('alert_data.date', 'desc')
            .limit(limit).offset(offset);
    }
    // RESTful post /alertData, handle income data from incline meter
    async postAlertData(
        device_id:number, 
        data:string, 
        date:string, 
        time:string, 
        latitude:string, 
        longitude:string, 
        address:string,
        battery:string,
        msgType:string){
        return await this.knex('alert_data').insert({
            device_id, data, date: new Date(date).toLocaleDateString('en-CA'), time, geolocation:`${latitude},${longitude}`, address , battery, msgType
        }).returning('id');
    }
    // RESTful Put /alertData
    async putAlertData(){
        return;
    }
    // RESTful Del /alertData
    async deleteAlertData(){
        return;
    }

    // get /alertData, when searching
    async getAlertDataBySearch(offset:number, limit:number, searchType:string, searchString:string){
      return await this.knex
        .select('alert_data.id', 'devices.device_name', 'devices.device_eui', `alert_data.date`, 
            'alert_data.time', 'alert_data.geolocation', 'alert_data.battery', 'alert_data.address', 
            'companies.company_name', 'companies.tel', 'companies.contact_person', 'alert_data.created_at',
            'vehicles.car_plate', 'vehicles.vehicle_model', 'vehicle_type', 'alert_data.msgType')
            .from('alert_data')
            .leftJoin('devices', 'devices.id', 'alert_data.device_id')
            .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
            .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
            .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
            .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
            .where({'companies.is_active': true, 'devices.is_active': true, 'alert_data.is_active': true
                    , 'vehicles.is_active':true, 'company_vehicles.is_active': true, 'vehicle_device.is_active': true, 
                    'alert_data.msgType':'A'
                  })
            .andWhere(`${searchType}`,'ILIKE',`%${searchString}%`)
            .orderBy('alert_data.date', 'desc')
            .limit(limit).offset(offset);
    }
    // search date 
    async getAlertDataBySearchDate(offset:number, limit:number,date:string,nextDate:string){
      return await this.knex
        .select('alert_data.id', 'devices.device_name', 'devices.device_eui', `alert_data.date`, 
          'alert_data.time', 'alert_data.geolocation', 'alert_data.battery', 'alert_data.address', 
          'companies.company_name', 'companies.tel', 'companies.contact_person', 'alert_data.created_at',
          'vehicles.car_plate', 'vehicles.vehicle_model', 'vehicle_type', 'alert_data.msgType')
        .from('alert_data')
        .leftJoin('devices', 'devices.id', 'alert_data.device_id')
        .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
        .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
        .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
        .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
        .where({'companies.is_active': true, 'devices.is_active': true, 'alert_data.is_active': true
                , 'vehicles.is_active':true, 'company_vehicles.is_active': true, 'vehicle_device.is_active': true, 
                'alert_data.msgType':'A'
              })
        .andWhereRaw(`alert_data.date >= ${date} 00:00:00 AND alert_data.date < ${nextDate} 00:00:00`)
        .orderBy('alert_data.date', 'desc')
        .limit(limit).offset(offset);
    }


  // RESTful get /history, get grouping data with one user
  async getUserGroupingData(deviceEUI: string) {
    return await this.knex
      .select(
        'devices.device_name',
        'alert_data.date',
        'users.name',
        'users.phone',
        'users.car_plate'
      )
      .count('alert_data.date')
      .from('alert_data')
      .leftJoin('devices', 'devices.id', 'alert_data.devices_id')
      .leftJoin('users', 'users.id', 'devices.users_id')
      .where({
        'devices.dev_eui': `${deviceEUI}`,
        'users.is_active': true,
        'devices.is_active': true,
        'alert_data.is_active': true,
      })
      .groupBy(
        'alert_data.date',
        'devices.device_name',
        'users.name',
        'users.phone',
        'users.car_plate'
      )
      .orderBy('date', 'desc');
  }
////---- RESTful /companies ----////
  // get /companies
  async getCompaniesData(offset:number, limit:number): Promise<any> {
    return await this.knex('companies')
      .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
      .where({ 'companies.is_active': true, 'company_vehicles.is_active': true })
      .groupBy('companies.id')
      .distinct('companies.id')
      .select('companies.id', 'companies.company_name', 'companies.tel', 'companies.contact_person')
      .count('company_vehicles.company_id')
      .limit(limit).offset(offset);
  }
  // get /companies, when searching string
  async getCompaniesDataBySearch(offset:number, limit:number, searchType:string, searchString:string|number): Promise<any> {
    return await this.knex('companies')
      .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
      .where({ 'companies.is_active': true, 'company_vehicles.is_active': true })
      .groupBy('companies.id')
      .distinct('companies.id')
      .select('companies.company_name', 'companies.tel', 'companies.contact_person') 
      .count('company_vehicles.company_id')
      .havingRaw(`${searchType} ILIKE ?`, [searchString])
      .limit(limit).offset(offset);
  }
  // get /companies, when searching number
  async getCompaniesDataNumberBySearch(offset:number, limit:number, searchString:string|number): Promise<any> {
    return await this.knex('companies')
      .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
      .where({ 'companies.is_active': true, 'company_vehicles.is_active': true })
      .groupBy('companies.id')
      .distinct('companies.id')
      .select('companies.company_name', 'companies.tel', 'companies.contact_person')
      .count('company_vehicles.company_id')
      .havingRaw(`(companies.id, count(company_vehicles.company_id)) in 
      (select distinct(company_id), count(id) from company_vehicles group by company_id having count(id) = ${searchString})`)
      .limit(limit).offset(offset);
  }
  // post /companies
  async postCompaniesData(companyName:string, contactPerson:string, tel:string): Promise<number>{
    //console.log(companyName + ' ' + contactPerson + ' ' + tel);
    return await this.knex('companies')
      .insert({company_name: companyName, contact_person: contactPerson, tel: tel})
      .returning('id');
  }
  // put /companies
  // delete /companies
////---- RESTful /devices ----////
  // RESTful get /devices
  async getDevicesData(offset:number, limit:number): Promise<any> {
    return await this.knex('devices')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'devices.is_active': true,
        'vehicle_device.is_active': true,
        'vehicles.is_active': true,
        'company_vehicles.is_active': true,
        'companies.is_active': true,
      })
      .select(
        'devices.id',
        'devices.device_name',
        'devices.device_eui',
        'devices.is_register',
        'vehicles.car_plate',
        'vehicles.vehicle_model',
        'vehicles.vehicle_type',
        'companies.company_name',
        'companies.tel',
        'companies.contact_person'
      )
      .offset(offset).limit(limit);
  }

  // RESTful get by searching /devices
  async getDevicesDataBySearch(offset: number, limit:number, searchType:string, searchString:string): Promise<any> {
    return await this.knex('devices')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'devices.is_active': true,
        'vehicle_device.is_active': true,
        'vehicles.is_active': true,
        'company_vehicles.is_active': true,
        'companies.is_active': true,
      })
      .andWhere(`${searchType}`,'ILIKE',`%${searchString}%`)
      .select(
        'devices.id',
        'devices.device_name',
        'devices.device_eui',
        'vehicles.car_plate',
        'vehicles.vehicle_model',
        'vehicles.vehicle_type',
        'companies.company_name',
        'companies.tel',
        'companies.contact_person'
      )
      .offset(offset).limit(limit)
  }
  // get only devices
  async getOnlyDevices(){
    return this.knex('devices')
      .where('is_active', true)
      .select(
        'id', 'device_name', 'device_eui', 'version',
        'is_register', 'is_active'
      )
  }
  // post devices , for device join
  async postDevices(name: string, deviceID: string){
    return this.knex('devices')
      .insert({device_name: name, device_eui:deviceID});
  }
////---- vehicles ----////
  //get vehicles
  //post vehicles
  async postVehicles(carPlate:string, vehicleType:string, vehicleModel:string):Promise<number>{
    //console.log(carPlate + ' ' + vehicleType + ' ' + vehicleModel);
    return this.knex('vehicles')
      .insert({car_plate: carPlate, vehicle_type: vehicleType, vehicle_model: vehicleModel})
      .returning('id');
  }
  //put vehicles
  //delete vehicles

////---- company_vehicles ----////
  // post company_vehicles
  async postCompanyVehicles(companyID:number, vehiclesID:any){
    return this.knex('company_vehicles')
      .insert({company_id: companyID, vehicle_id: vehiclesID})
  }
////---- vehicle_device ----////
  // post vehicle_device
  async postVehicleDevice(vehicleID:number, deviceID:number){
    return this.knex('vehicle_device')
      .insert({vehicle_id: vehicleID, device_id: deviceID})
  }
////---- counting ----////
  // get count data , /alert_data
  async getCountingAlertData() {
    return await this.knex('alert_data')
    .where('msgType','A')
    .count('id');
  }
  // get count data by searching, /alert_data
  async getCountingAlertDataBySearch(searchType:string, searchString:string){
    return await this.knex('alert_data')
      .leftJoin('devices', 'devices.id', 'alert_data.device_id')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({'companies.is_active': true, 'devices.is_active': true, 'alert_data.is_active': true
            , 'vehicles.is_active':true, 'company_vehicles.is_active': true, 'vehicle_device.is_active': true
            ,'alert_data.msgType':'A'})
      .andWhere(`${searchType}`,'ILIKE',`%${searchString}%`)
      .count('alert_data.id');
  }
  // get count data by searhing date, /alert_data
  async getCountingAlertDataBySearchDate(date: string, nextDate: string){
    return await this.knex('alert_data')
      .leftJoin('devices', 'devices.id', 'alert_data.device_id')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({'companies.is_active': true, 'devices.is_active': true, 'alert_data.is_active': true
            , 'vehicles.is_active':true, 'company_vehicles.is_active': true, 'vehicle_device.is_active': true
            ,'alert_data.msgType':'A'})
      .andWhereRaw(`alert_data.date >= ${date} 00:00:00 AND alert_data.date < ${nextDate} 00:00:00`)
      .count('alert_data.id');
  }
  // get count data, /companies
  async getCountingCompanies(){
    return await this.knex('companies').count('id');
    }
  // get searching , /companies
  async getCountingCompaniesBySearch(searchType:string, searchString:string|number, sqlLike:string){
    return await this.knex('companies')
    .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
    .where({ 'companies.is_active': true, 'company_vehicles.is_active': true })
    .groupBy('companies.id')
    .distinct('companies.id')
    .havingRaw(`${searchType} ${sqlLike} ?`, [searchString])
  }
  // get count data, /devices
  async getCountingDevices(){
    return await this.knex('devices').count('id');
  }
  // get searching, /devices
  async getCountingDevicesBySearch(searchType:string, searchString:string){
    return await this.knex('devices')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'devices.is_active': true,
        'vehicle_device.is_active': true,
        'vehicles.is_active': true,
        'company_vehicles.is_active': true,
        'companies.is_active': true,
      })
      .andWhere(`${searchType}`,'ILIKE',`%${searchString}%`)
      .count('devices.id')
  }
////---- others ----////
  // get device id to confirm
  async getDevicesID(reqName: string, reqEUI: string): Promise<any> {
    return await this.knex
      .select('id')
      .from('devices')
      .where({ device_name: reqName, device_eui: reqEUI })
      .first();
  }

  // get device version & is_active , for update version
  async getDevicesVersion(version: string){
    return await this.knex('devices')
    .where({ device_eui: 'jPlXIAADvQ0=', is_active: true})
    .select('id', 'device_name', 'device_eui', 'version', 'is_active')
  }

  // get profile for company
  async getProfileByID(id:number){
    return await this.knex('companies')
      .leftJoin('company_vehicles','company_vehicles.company_id','companies.id')
      .leftJoin('vehicles','vehicles.id','company_vehicles.vehicle_id')
      .leftJoin('vehicle_device','vehicle_device.vehicle_id','vehicles.id')
      .leftJoin('devices','devices.id','vehicle_device.device_id')
      .where('companies.id', id)
      .select(
        'companies.id','companies.company_name','companies.tel','companies.contact_person',
        'vehicles.car_plate','vehicles.vehicle_model','vehicles.vehicle_type',
        'devices.device_eui','devices.device_name','devices.is_active'
      )
  }

  async getBatteryData(offset:number, limit:number): Promise<any>{
    return await this.knex
      .select('alert_data.id', 'devices.device_name', 'devices.device_eui', `alert_data.date`, 
      'alert_data.time', 'alert_data.geolocation', 'alert_data.battery', 'alert_data.address', 
      'companies.company_name', 'companies.tel', 'companies.contact_person', 'alert_data.created_at', 
      'vehicles.car_plate', 'vehicles.vehicle_model', 'vehicle_type', 'alert_data.msgType')
      .from('alert_data')
      .leftJoin('devices', 'devices.id', 'alert_data.device_id')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({'companies.is_active': true, 'devices.is_active': true, 'alert_data.is_active': true
      , 'vehicles.is_active':true, 'company_vehicles.is_active': true, 'vehicle_device.is_active': true
      ,'alert_data.msgType':'B'})
      .orderBy('alert_data.date', 'desc')
      .limit(limit).offset(offset);
  }
  async getAllMsgTypeData(offset:number, limit:number){
    return await this.knex
      .select('alert_data.id', 'devices.device_name', 'devices.device_eui', `alert_data.date`, 
      'alert_data.time', 'alert_data.geolocation', 'alert_data.battery', 'alert_data.address', 
      'companies.company_name', 'companies.tel', 'companies.contact_person', 'alert_data.created_at', 
      'vehicles.car_plate', 'vehicles.vehicle_model', 'vehicle_type', 'alert_data.msgType')
      .from('alert_data')
      .leftJoin('devices', 'devices.id', 'alert_data.device_id')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({'companies.is_active': true, 'devices.is_active': true, 'alert_data.is_active': true
      , 'vehicles.is_active':true, 'company_vehicles.is_active': true, 'vehicle_device.is_active': true})
      .orderBy('alert_data.date', 'desc')
      .limit(limit).offset(offset);
  }
}
