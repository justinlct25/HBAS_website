import * as Knex from 'knex';

export class DataService {
  constructor(private knex: Knex) {}
  // RESTful get /alertData, get all data in database
  async getAlertData(offset: number, limit: number): Promise<any> {
    return await this.knex
      .select(
        'alert_data.id',
        'devices.device_name',
        'devices.device_eui',
        `alert_data.date`,
        'alert_data.geolocation',
        'alert_data.battery',
        'alert_data.address',
        'companies.company_name',
        'companies.tel',
        'companies.contact_person',
        'vehicles.car_plate',
        'vehicles.vehicle_model',
        'vehicle_type',
        'alert_data.msg_type'
      )
      .from('alert_data')
      .leftJoin('devices', 'devices.id', 'alert_data.device_id')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'companies.is_active': true,
        'devices.is_active': true,
        'alert_data.is_active': true,
        'vehicles.is_active': true,
        'company_vehicles.is_active': true,
        'vehicle_device.is_active': true,
        'alert_data.msg_type': 'A',
      })
      .orderBy('alert_data.date', 'desc')
      .limit(limit)
      .offset(offset);
  }
  // RESTful post /alertData, handle income data from incline meter
  async postAlertData(
    device_id: number,
    data: string,
    date: string,
    latitude: string,
    longitude: string,
    address: string,
    battery: string,
    msg_type: string
  ) {
    return await this.knex('alert_data')
      .insert({
        device_id,
        data,
        date: date,
        geolocation: `${latitude},${longitude}`,
        address,
        battery,
        msg_type,
      })
      .returning('id');
  }
  // RESTful Put /alertData
  async putAlertData() {
    return;
  }
  // RESTful Del /alertData
  async deleteAlertData() {
    return;
  }

  // get /alertData, when searching
  async getAlertDataBySearch(
    offset: number,
    limit: number,
    searchType: string,
    searchString: string
  ) {
    return await this.knex
      .select(
        'alert_data.id',
        'devices.device_name',
        'devices.device_eui',
        `alert_data.date`,
        'alert_data.geolocation',
        'alert_data.battery',
        'alert_data.address',
        'companies.company_name',
        'companies.tel',
        'companies.contact_person',
        'vehicles.car_plate',
        'vehicles.vehicle_model',
        'vehicle_type',
        'alert_data.msg_type'
      )
      .from('alert_data')
      .leftJoin('devices', 'devices.id', 'alert_data.device_id')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'companies.is_active': true,
        'devices.is_active': true,
        'alert_data.is_active': true,
        'vehicles.is_active': true,
        'company_vehicles.is_active': true,
        'vehicle_device.is_active': true,
        'alert_data.msg_type': 'A',
      })
      .andWhere(`${searchType}`, 'ILIKE', `%${searchString}%`)
      .orderBy('alert_data.date', 'desc')
      .limit(limit)
      .offset(offset);
  }
  // search date
  async getAlertDataBySearchDate(offset: number, limit: number, date: string, nextDate: string) {
    return await this.knex
      .select(
        'alert_data.id',
        'devices.device_name',
        'devices.device_eui',
        `alert_data.date`,
        'alert_data.geolocation',
        'alert_data.battery',
        'alert_data.address',
        'companies.company_name',
        'companies.tel',
        'companies.contact_person',
        'vehicles.car_plate',
        'vehicles.vehicle_model',
        'vehicle_type',
        'alert_data.msg_type'
      )
      .from('alert_data')
      .leftJoin('devices', 'devices.id', 'alert_data.device_id')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'companies.is_active': true,
        'devices.is_active': true,
        'alert_data.is_active': true,
        'vehicles.is_active': true,
        'company_vehicles.is_active': true,
        'vehicle_device.is_active': true,
        'alert_data.msg_type': 'A',
      })
      .andWhereRaw(`alert_data.date >= ${date} 00:00:00 AND alert_data.date < ${nextDate} 00:00:00`)
      .orderBy('alert_data.date', 'desc')
      .limit(limit)
      .offset(offset);
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
  async getCompaniesData(offset: number, limit: number) {
    return await this.knex.raw(`
    select companies.id, companies.company_name, 
    companies.tel, companies.contact_person, 
    count(company_vehicles.company_id),companies.updated_at as c_updated_at 
    from companies
    left join company_vehicles on company_vehicles.company_id = companies.id
    where companies.is_active = true and company_vehicles.is_active = true
    group by companies.id
    union 
    select companies.id, companies.company_name, 
    companies.tel, companies.contact_person, 
    count(company_vehicles.company_id),companies.updated_at as c_updated_at
    from companies
    left join company_vehicles on company_vehicles.company_id = companies.id
    where companies.is_active = true and company_vehicles.is_active is null
    group by companies.id
    order by c_updated_at
    limit ? offset ?
  `, [limit, offset]);
  /*
    await this.knex('companies')
      .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
      .where({ 'companies.is_active': true, 'company_vehicles.is_active': true})
      .select(
        'companies.id',
        'companies.company_name',
        'companies.tel',
        'companies.contact_person',
        'companies.updated_at'
        )
        .count('company_vehicles.company_id')
        .groupBy('companies.id')
      .unionAll(function(){
        this.from('companies')
          .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
          .where({ 'companies.is_active': true})
          .whereNull('company_vehicles.is_active')
          .select(
            'companies.id',
            'companies.company_name',
            'companies.tel',
            'companies.contact_person',
            'companies.updated_at as company_updated_at'
            )
            .count('company_vehicles.company_id')
            // .groupBy('companies.id')
        }, false)
      // .groupBy('companies.id')
      .orderBy('companies.updated_at', 'desc')
      .limit(limit)
      .offset(offset);*/
  }
  // get /companies, when searching string
  async getCompaniesDataBySearch(
    offset: number,
    limit: number,
    searchType: string,
    searchString: string | number
  ): Promise<any> {
    return await this.knex('companies')
      .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
      .where({ 'companies.is_active': true })
      .groupBy('companies.id')
      .distinct('companies.id')
      .select(
        'companies.company_name', 
        'companies.tel', 
        'companies.contact_person',
        'companies.updated_at'
      )
      .count<number>('company_vehicles.company_id')
      .havingRaw(`${searchType} ILIKE ?`, [searchString])
      .orderBy('companies.updated_at', 'desc')
      .limit(limit)
      .offset(offset);
  }
  // get /companies, when searching number
  async getCompaniesDataNumberBySearch(
    offset: number,
    limit: number,
    searchString: string | number
  ): Promise<any> {
    return await this.knex('companies')
      .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
      .where({ 'companies.is_active': true })
      .groupBy('companies.id')
      .distinct('companies.id')
      .select('companies.company_name', 'companies.tel', 'companies.contact_person')
      .count('company_vehicles.company_id')
      .havingRaw(
        `(companies.id, count(company_vehicles.company_id)) in 
      (select distinct(company_id), count(id) from company_vehicles group by company_id having count(id) = ${searchString})`
      )
      .orderBy('companies.updated_at', 'desc')
      .limit(limit)
      .offset(offset);
  }
  //get companies data for add devices
  async getCompaniesByDevicePage() {
    return await this.knex('companies')
      .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
      .leftJoin('vehicles', 'vehicles.id', 'company_vehicles.vehicle_id')
      .leftJoin('vehicle_device', 'vehicle_device.vehicle_id', 'vehicles.id')
      .whereNotIn('company_vehicles.id', function(){
        this.from('companies')
            .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
            .leftJoin('vehicles', 'vehicles.id', 'company_vehicles.vehicle_id')
            .leftJoin('vehicle_device', 'vehicle_device.vehicle_id', 'vehicles.id')
            .where('vehicle_device.is_active', false)
            .select('company_vehicles.id')
      })
      .where({
        'companies.is_active': true,
        'company_vehicles.is_active': true,
        'vehicles.is_active': true,
      })
      .select(
        'companies.id as company_id',
        'companies.company_name',
        'vehicles.id as vehicle_id',
        'vehicles.car_plate',
        'vehicle_device.is_active as vehicle_device_active'
      )
  }
  // post /companies
  async postCompaniesData(companyName: string, contactPerson: string, tel: string) {
    //console.log(companyName + ' ' + contactPerson + ' ' + tel);
    return await this.knex('companies')
      .insert({ company_name: companyName, contact_person: contactPerson, tel: tel })
      .returning<number>('id');
  }
  // put /companies
  // delete /companies

  ////---- RESTful /devices ----////
  // RESTful get /devices
  async getDevicesData(offset: number, limit: number) {
    return await this.knex('devices')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'devices.is_active': true,
      })
      .select(
        'devices.id',
        'devices.device_name',
        'devices.device_eui',
        'devices.is_register',
        'vehicles.id as vehicle_id',
        'vehicles.car_plate',
        'vehicles.vehicle_model',
        'vehicles.vehicle_type',
        'companies.id as company_id',
        'companies.company_name',
        'companies.tel',
        'companies.contact_person'
      )
      .orderBy('devices.updated_at', 'desc')
      .offset(offset)
      .limit(limit);
  }

  // RESTful get by searching /devices
  async getDevicesDataBySearch(
    offset: number,
    limit: number,
    searchType: string,
    searchString: string
  ): Promise<any> {
    return await this.knex('devices')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'devices.is_active': true,
      })
      .andWhere(`${searchType}`, 'ILIKE', `%${searchString}%`)
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
      .orderBy('devices.updated_at', 'desc')
      .offset(offset)
      .limit(limit);
  }
  // get only devices for register
  async getAllDevices() {
    return await this.knex('devices')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'devices.is_active': true,
        // 'vehicle_device.is_active': true,
        // 'company_vehicles.is_active': true
      })
      // .andWhereNot('vehicle_device.is_active', false)
      .orderBy('devices.updated_at', 'desc')
      .select(
        'devices.id',
        'devices.device_name',
        'devices.device_eui',
        'devices.is_register',
        'vehicles.car_plate',
        'companies.company_name'
      );
  }
  // post devices , for device join
  async postDevices(name: string, deviceID: string) {
    return await this.knex('devices').insert({ device_name: name, device_eui: deviceID });
  }
  // put devices
  async putDevices(id: number) {
    return await this.knex('devices')
      .where('id', id)
      .update({ is_register: false }, ['id', 'is_register']);
  }
  // delete devices
  ////---- vehicles ----////
  //get vehicles
  //post vehicles
  async postVehicles(carPlate: string, vehicleType: string, vehicleModel: string) {
    //console.log(carPlate + ' ' + vehicleType + ' ' + vehicleModel);
    return await this.knex('vehicles')
      .insert({ car_plate: carPlate, vehicle_type: vehicleType, vehicle_model: vehicleModel })
      .returning<number>('id');
  }
  //put vehicles
  //delete vehicles

  ////---- company_vehicles ----////
  // post company_vehicles
  async postCompanyVehicles(companyID: number, vehiclesID: any) {
    return await this.knex('company_vehicles').insert({
      company_id: companyID,
      vehicle_id: vehiclesID,
    });
  }
  ////---- vehicle_device ----////
  // get vehicle_device
  async getVehicleDevice(vehicleID: number, deviceID: number) {
    return await this.knex('vehicle_device')
      .where('is_active', true)
      .groupBy('id')
      .having('device_id', '=', deviceID)
      .orHaving('vehicle_id', '=', vehicleID)
      .select('id as vehicle_device_id', 'device_id', 'vehicle_id')
      .orderBy('updated_at', 'desc')
      .first();
  }
  // post vehicle_device
  async postVehicleDevice(vehicleID: number, deviceID: number) {
    return await this.knex('vehicle_device').insert({ vehicle_id: vehicleID, device_id: deviceID });
  }
  // put vehicle_device
  async putVehicleDevice(vehicle_device_id: number) {
    return await this.knex('vehicle_device')
      .where('id', vehicle_device_id)
      .update('is_active', false);
  }
  ////---- counting ----////
  // get count data , /alert_data
  async getCountingAlertData() {
    return await this.knex('alert_data').where('msg_type', 'A').count('id');
  }
  // get count data by searching, /alert_data
  async getCountingAlertDataBySearch(searchType: string, searchString: string) {
    return await this.knex('alert_data')
      .leftJoin('devices', 'devices.id', 'alert_data.device_id')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'companies.is_active': true,
        'devices.is_active': true,
        'alert_data.is_active': true,
        'vehicles.is_active': true,
        'company_vehicles.is_active': true,
        'vehicle_device.is_active': true,
        'alert_data.msg_type': 'A',
      })
      .andWhere(`${searchType}`, 'ILIKE', `%${searchString}%`)
      .count('alert_data.id');
  }
  // get count data by searhing date, /alert_data
  async getCountingAlertDataBySearchDate(date: string, nextDate: string) {
    return await this.knex('alert_data')
      .leftJoin('devices', 'devices.id', 'alert_data.device_id')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'companies.is_active': true,
        'devices.is_active': true,
        'alert_data.is_active': true,
        'vehicles.is_active': true,
        'company_vehicles.is_active': true,
        'vehicle_device.is_active': true,
        'alert_data.msg_type': 'A',
      })
      .andWhereRaw(`alert_data.date >= ${date} 00:00:00 AND alert_data.date < ${nextDate} 00:00:00`)
      .count('alert_data.id');
  }
  // get count data, /companies
  async getCountingCompanies() {
    return await this.knex('companies')
      .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
      .where({ 'companies.is_active': true , 'company_vehicles.is_active': true})
      .select('companies.id')
      .union(function(){
        this.from('companies')
          .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
          .where({ 'companies.is_active': true })
          .whereNull('company_vehicles.is_active')
          .select('companies.id')
      })
      .groupBy('companies.id')
  }
  // get searching , /companies
  async getCountingCompaniesBySearch(
    searchType: string,
    searchString: string | number,
    sqlLike: string
  ) {
    return await this.knex('companies')
      .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
      .where({ 'companies.is_active': true })
      .groupBy('companies.id')
      .distinct('companies.id')
      .havingRaw(`${searchType} ${sqlLike} ?`, [searchString]);
  }
  // get count data, /devices
  async getCountingDevices() {
    return await this.knex('devices').count('id');
  }
  // get searching, /devices
  async getCountingDevicesBySearch(searchType: string, searchString: string) {
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
      .andWhere(`${searchType}`, 'ILIKE', `%${searchString}%`)
      .count('devices.id');
  }
  ////---- others ----////
  // get device id to confirm
  async getDevicesID(reqEUI: string) {
    return await this.knex
      .select<{ id: number }>('id')
      .from('devices')
      .where({ device_eui: reqEUI })
      .first();
  }

  // get device version & is_active , for update version
  async getDevicesVersion(version: string) {
    return await this.knex('devices')
      .where({ device_eui: 'jPlXIAADvQ0=', is_active: true })
      .select('id', 'device_name', 'device_eui', 'version', 'is_active');
  }

  // get profile for company
  async getProfileByID(id: number) {
    return await this.knex('companies')
      .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
      .leftJoin('vehicles', 'vehicles.id', 'company_vehicles.vehicle_id')
      .leftJoin('vehicle_device', 'vehicle_device.vehicle_id', 'vehicles.id')
      .leftJoin('devices', 'devices.id', 'vehicle_device.device_id')
      .where({
        'companies.id': id,
        'companies.is_active':true,
        'vehicles.is_active': true,
        'company_vehicles.is_active': true
      })
      // .andWhereNot('vehicle_device.is_active', false)
      .select(
        'companies.id',
        'companies.company_name',
        'companies.tel',
        'companies.contact_person',
        'vehicles.id as vehicle_id',
        'vehicles.car_plate',
        'vehicles.vehicle_model',
        'vehicles.vehicle_type',
        'devices.id as device_id',
        'devices.device_eui',
        'devices.device_name',
        'devices.is_active'
      )
      .union(function(){
        this.from('companies')
          .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
          .leftJoin('vehicles', 'vehicles.id', 'company_vehicles.vehicle_id')
          .leftJoin('vehicle_device', 'vehicle_device.vehicle_id', 'vehicles.id')
          .leftJoin('devices', 'devices.id', 'vehicle_device.device_id')
          .where({
            'companies.id': id,
            'companies.is_active':true,
          })
          .whereNull('company_vehicles.is_active')
          .whereNull('vehicles.is_active')
          .select(
            'companies.id',
            'companies.company_name',
            'companies.tel',
            'companies.contact_person',
            'vehicles.id as vehicle_id',
            'vehicles.car_plate',
            'vehicles.vehicle_model',
            'vehicles.vehicle_type',
            'devices.id as device_id',
            'devices.device_eui',
            'devices.device_name',
            'devices.is_active'
          )
      })
      //.orderBy('vehicles.updated_at', 'desc')
  }
  // check duplicate #company_name
  async checkCompanyDuplicate(company_name: string) {
    return await this.knex('companies')
      .where('company_name', 'ILIKE', `${company_name}`)
      .andWhere('is_active', true)
      .count('id')
  }
  // check duplicate #car_plate
  async checkCarPlateDuplicate(car_plate: string) {
    return await this.knex('vehicles')
      .where('car_plate', 'ILIKE', `${car_plate}`)
      .andWhere('is_active', true)
      .count('id')
  }

  async getBatteryData(offset: number, limit: number): Promise<any> {
    return await this.knex
    .select(
      'alert_data.id',
      'devices.device_name',
      'devices.device_eui',
      `alert_data.date`,
      'alert_data.geolocation',
      'alert_data.battery',
      'alert_data.address',
      'companies.company_name',
      'companies.tel',
      'companies.contact_person',
      'vehicles.car_plate',
      'vehicles.vehicle_model',
      'vehicle_type',
      'alert_data.msg_type'
    )
    .from('alert_data')
    .leftJoin('devices', 'devices.id', 'alert_data.device_id')
    .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
    .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
    .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
    .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
    .where({
      'companies.is_active': true,
      'devices.is_active': true,
      'alert_data.is_active': true,
      'vehicles.is_active': true,
      'company_vehicles.is_active': true,
      'vehicle_device.is_active': true,
      'alert_data.msg_type': 'B',
    })
    .orderBy('alert_data.date', 'desc')
    .limit(limit)
    .offset(offset);
  }
  async getAllMsgTypeData(offset: number, limit: number) {
    return await this.knex
      .select(
        'alert_data.id',
        'devices.device_name',
        'devices.device_eui',
        `alert_data.date`,
        'alert_data.geolocation',
        'alert_data.battery',
        'alert_data.address',
        'companies.company_name',
        'companies.tel',
        'companies.contact_person',
        'vehicles.car_plate',
        'vehicles.vehicle_model',
        'vehicle_type',
        'alert_data.msg_type'
      )
      .from('alert_data')
      .leftJoin('devices', 'devices.id', 'alert_data.device_id')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'companies.is_active': true,
        'devices.is_active': true,
        'alert_data.is_active': true,
        'vehicles.is_active': true,
        'company_vehicles.is_active': true,
        'vehicle_device.is_active': true,
      })
      .orderBy('alert_data.date', 'desc')
      .limit(limit)
      .offset(offset);
  }
}
