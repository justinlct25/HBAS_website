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
        'alert_data.time',
        'alert_data.latitude',
        'alert_data.longitude',
        'alert_data.battery',
        'companies.company_name',
        'companies.tel',
        'companies.contact_person',
        'vehicles.car_plate',
        'vehicles.vehicle_model',
        'vehicle_type'
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
  // RESTful post /alertData, handle income data from incline meter
  async postAlertData(
    device_id: number,
    data: string,
    date: string,
    time: string,
    latitude: string,
    longitude: string,
    battery: string
  ) {
    return await this.knex('alert_data')
      .insert({
        device_id,
        data,
        date,
        time,
        latitude,
        longitude,
        battery,
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

  //RESTful get /companies
  async getCompaniesData(): Promise<any> {
    return await this.knex('companies')
      .leftJoin('company_vehicles', 'company_vehicles.company_id', 'companies.id')
      .groupBy(
        'companies.id',
        'companies.company_name',
        'companies.tel',
        'companies.contact_person',
        'company_vehicles.company_id'
      )
      .where({ 'companies.is_active': true, 'company_vehicles.is_active': true })
      .select('companies.id', 'companies.company_name', 'companies.tel', 'companies.contact_person')
      .count('company_vehicles.company_id');
  }

  // RESTful get /devices
  async getDevicesData(): Promise<any> {
    return await this.knex('devices')
      .leftJoin('vehicle_device', 'vehicle_device.device_id', 'devices.id')
      .leftJoin('vehicles', 'vehicles.id', 'vehicle_device.vehicle_id')
      .leftJoin('company_vehicles', 'company_vehicles.vehicle_id', 'vehicles.id')
      .leftJoin('companies', 'companies.id', 'company_vehicles.company_id')
      .where({
        'companies.is_active': true,
        'devices.is_active': true,
        'vehicles.is_active': true,
        'company_vehicles.is_active': true,
        'vehicle_device.is_active': true,
      })
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
      );
  }

  // get count data
  async getCountingData() {
    return await this.knex('alert_data').count('id');
  }

  // get device id to confirm
  async getDevicesID(reqName: string, reqEUI: string): Promise<any> {
    return await this.knex
      .select('id')
      .from('devices')
      .where({ device_name: reqName, device_eui: reqEUI })
      .first();
  }
}
