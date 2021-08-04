import { Knex } from 'knex';
import { tables } from '../utils/table_model';

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
    return await this.knex(tables.ALERT_DATA)
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

  ////---- RESTful /companies ----////
  // get /companies
  async getCompaniesData(offset: number, limit: number) {
    return await this.knex.raw(
      `
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
  `,
      [limit, offset]
    );
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

  // post /companies
  async postCompaniesData(companyName: string, contactPerson: string, tel: string) {
    return await this.knex(tables.COMPANIES)
      .insert({ company_name: companyName, contact_person: contactPerson, tel: tel })
      .returning<number>('id');
  }

  // post devices , for device join
  async postDevices(device_name: string, device_eui: string) {
    return await this.knex(tables.DEVICES)
    .insert({ device_name, device_eui });
  }
  ////---- vehicles ----////
  //post vehicles
  async postVehicles(carPlate: string, vehicleType: string, vehicleModel: string) {
    return await this.knex(tables.VEHICLES)
      .insert({ car_plate: carPlate, vehicle_type: vehicleType, vehicle_model: vehicleModel })
      .returning<number>('id');
  }

  ////---- company_vehicles ----////
  // post company_vehicles
  async postCompanyVehicles(companyID: number, vehiclesID: any) {
    return await this.knex(tables.COMPANY_VEHICLES).insert({
      company_id: companyID,
      vehicle_id: vehiclesID,
    });
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
      .where({ 'companies.is_active': true, 'company_vehicles.is_active': true })
      .select('companies.id')
      .union(function () {
        this.from('companies')
          .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
          .where({ 'companies.is_active': true })
          .whereNull('company_vehicles.is_active')
          .select('companies.id');
      })
      .groupBy('companies.id');
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

  ////---- others ----////
  // get device id to confirm
  async getDevicesID(reqEUI: string) {
    return await this.knex
      .select<{ id: number }>('id')
      .from(tables.DEVICES)
      .where({ device_eui: reqEUI })
      .first();
  }

  // check duplicate #company_name
  async checkCompanyDuplicate(company_name: string) {
    return await this.knex(tables.COMPANIES)
      .where('company_name', 'ILIKE', `${company_name}`)
      .andWhere('is_active', true)
      .select<{ id: number }[]>('id');
  }
  // check duplicate #car_plate
  async checkCarPlateDuplicate(car_plate: string) {
    return await this.knex(tables.VEHICLES)
      .where('car_plate', 'ILIKE', `${car_plate}`)
      .andWhere('is_active', true)
      .select<{ id: number }[]>('id');
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
  //// 20210802 edit / delete companies & vehicles
  async putCompanies(id: number, company_name: string, tel: string, contact_person: string) {
    return await this.knex(tables.COMPANIES)
      .where({ id: id, is_active: true })
      .update({ company_name, tel, contact_person, updated_at: new Date(Date.now()) });
  }
  async putVehicles(id: number, car_plate: string, vehicle_model: string, vehicle_type: string) {
    return await this.knex(tables.VEHICLES)
      .where({ id: id, is_active: true })
      .update({ car_plate, vehicle_model, vehicle_type, updated_at: new Date(Date.now()) });
  }
  async deleteCompanies(id: number[]) {
    return await this.knex(tables.COMPANIES)
      .whereIn('id', id)
      .update({ is_active: false, updated_at: new Date(Date.now()) })
      .returning('id');
  } // delete#companies 1
  async deleteVehicles(id: number[]) {
    return await this.knex(tables.VEHICLES)
      .whereIn('id', id)
      .update({ is_active: false, updated_at: new Date(Date.now()) })
      .returning('id');
  } // delete#vehicles 1 || delete#companies 3
  async deleteCompanyVehicles(id: number[], table: string) {
    let whereField, returnField;
    switch (table) {
      case tables.VEHICLES:
        whereField = 'vehicle_id';
        returnField = 'company_id';  
      break;
      case tables.COMPANIES:
        whereField = 'company_id';
        returnField = 'vehicle_id';
        break;
    } 
    return await this.knex(tables.COMPANY_VEHICLES)
                .whereIn(`${whereField}`, id)
                .andWhere('is_active', true)
                .update({
                  is_active: false,
                  updated_at: new Date(Date.now()),
                })
                .returning(`${returnField}`);
  } // delete#vehicles 2 || delete#companies 2
  async deleteVehicleDevice(id: number[], table: string) {
    let query;
    switch (table) {
      case tables.DEVICES:
        query = this.knex(tables.VEHICLE_DEVICE)
          .whereIn('device_id', id)
          .andWhere('is_active', true)
          .update({
            is_active: false,
            updated_at: new Date(Date.now()),
          });
        break;
      default:
        query = this.knex(tables.VEHICLE_DEVICE)
        .whereIn('vehicle_id', id)
        .andWhere('is_active', true)
        .update({
          is_active: false,
          updated_at: new Date(Date.now()),
        });
      break;
    }
    return await query;
  } // delete#vehicles 3 || delete#companies 4 || delete#devices 2
  //// 20210803 delete devices
  async deleteDevices(id: number[]) {
    return await this.knex(tables.DEVICES)
      .whereIn('id', id)
      .update({ is_active: false, updated_at: new Date(Date.now()) })
      .returning('id');
  } // delete#devices 1
}
