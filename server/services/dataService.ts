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

  // post devices , for device join
  async postDevices(device_name: string, device_eui: string) {
    return await this.knex(tables.DEVICES).insert({ device_name, device_eui });
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

  ////---- others ----////
  // get device id to confirm
  async getDevicesID(reqEUI: string) {
    return await this.knex
      .select<{ id: number }>('id')
      .from(tables.DEVICES)
      .where({ device_eui: reqEUI })
      .first();
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
