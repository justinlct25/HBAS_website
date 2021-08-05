import { Knex } from 'knex';
import { tables } from '../utils/table_model';
import { getAlertData } from '../models/modelV1';

const alert_data = tables.ALERT_DATA;
const companies = tables.COMPANIES;
const devices = tables.DEVICES;
const vehicles = tables.VEHICLES;
const company_vehicles = tables.COMPANY_VEHICLES;
const vehicle_device = tables.VEHICLE_DEVICE;

export class DataService {
  constructor(private knex: Knex) {}
  // RESTful get /alertData, get all data in database
  async getHandBrakeData(
    offset: number,
    limit: number,
    msgType: string | null,
    searchType: string | null,
    searchString: string | null
  ) {
    let dataResult;
    let dataCount = await this.getCountingAlertData(msgType);
    switch (msgType) {
      case null:
        dataResult = this.knex
          .select<getAlertData>(
            `${alert_data}.id`,
            `${devices}.device_name`,
            `${devices}.device_eui`,
            `${alert_data}.date`,
            `${alert_data}.geolocation`,
            `${alert_data}.battery`,
            `${alert_data}.address`,
            `${companies}.company_name`,
            `${companies}.tel`,
            `${companies}.contact_person`,
            `${vehicles}.car_plate`,
            `${vehicles}.vehicle_model`,
            `${vehicles}.vehicle_type`,
            `${alert_data}.msg_type`
          )
          .from(alert_data)
          .leftJoin(devices, `${devices}.id`, `${alert_data}.device_id`)
          .leftJoin(vehicle_device, `${vehicle_device}.device_id`, `${devices}.id`)
          .leftJoin(vehicles, `${vehicles}.id`, `${vehicle_device}.vehicle_id`)
          .leftJoin(company_vehicles, `${company_vehicles}.vehicle_id`, `${vehicles}.id`)
          .leftJoin(companies, `${companies}.id`, `${company_vehicles}.company_id`)
          .where({
            [`${companies}.is_active`]: true,
            [`${devices}.is_active`]: true,
            [`${alert_data}.is_active`]: true,
            [`${vehicles}.is_active`]: true,
            [`${company_vehicles}.is_active`]: true,
            [`${vehicle_device}.is_active`]: true,
          })
          .orderBy(`${alert_data}.date`, `desc`)
          .limit(limit)
          .offset(offset);
        break;
      default:
        dataResult = this.knex
          .select<getAlertData>(
            `${alert_data}.id`,
            `${devices}.device_name`,
            `${devices}.device_eui`,
            `${alert_data}.date`,
            `${alert_data}.geolocation`,
            `${alert_data}.battery`,
            `${alert_data}.address`,
            `${companies}.company_name`,
            `${companies}.tel`,
            `${companies}.contact_person`,
            `${vehicles}.car_plate`,
            `${vehicles}.vehicle_model`,
            `${vehicles}.vehicle_type`,
            `${alert_data}.msg_type`
          )
          .from(alert_data)
          .leftJoin(devices, `${devices}.id`, `${alert_data}.device_id`)
          .leftJoin(vehicle_device, `${vehicle_device}.device_id`, `${devices}.id`)
          .leftJoin(vehicles, `${vehicles}.id`, `${vehicle_device}.vehicle_id`)
          .leftJoin(company_vehicles, `${company_vehicles}.vehicle_id`, `${vehicles}.id`)
          .leftJoin(companies, `${companies}.id`, `${company_vehicles}.company_id`)
          .where({
            [`${companies}.is_active`]: true,
            [`${devices}.is_active`]: true,
            [`${alert_data}.is_active`]: true,
            [`${vehicles}.is_active`]: true,
            [`${company_vehicles}.is_active`]: true,
            [`${vehicle_device}.is_active`]: true,
            [`${alert_data}.msg_type`]: msgType,
          })
          .orderBy(`${alert_data}.date`, `desc`)
          .limit(limit)
          .offset(offset);
        break;
    }
    // const query = (build:Knex.QueryBuilder) => {
    // build.andWhere(`${searchType}`, 'ILIKE', `%${searchString}%`)
    // }
    if (!!searchString) {
      // dataResult.andWhere(query);
      const result = await dataResult;
      return { result, dataCount };
    } else {
      const result = await dataResult;
      return { result, dataCount };
    }
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
    return await this.knex(alert_data)
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
      .select<getAlertData>(
        `${alert_data}.id`,
        `${devices}.device_name`,
        `${devices}.device_eui`,
        `${alert_data}.date`,
        `${alert_data}.geolocation`,
        `${alert_data}.battery`,
        `${alert_data}.address`,
        `${companies}.company_name`,
        `${companies}.tel`,
        `${companies}.contact_person`,
        `${vehicles}.car_plate`,
        `${vehicles}.vehicle_model`,
        `${vehicles}.vehicle_type`,
        `${alert_data}.msg_type`
      )
      .from(alert_data)
      .leftJoin(devices, `${devices}.id`, `${alert_data}.device_id`)
      .leftJoin(vehicle_device, `${vehicle_device}.device_id`, `${devices}.id`)
      .leftJoin(vehicles, `${vehicles}.id`, `${vehicle_device}.vehicle_id`)
      .leftJoin(company_vehicles, `${company_vehicles}.vehicle_id`, `${vehicles}.id`)
      .leftJoin(companies, `${companies}.id`, `${company_vehicles}.company_id`)
      .where({
        [`${companies}.is_active`]: true,
        [`${devices}.is_active`]: true,
        [`${alert_data}.is_active`]: true,
        [`${vehicles}.is_active`]: true,
        [`${company_vehicles}.is_active`]: true,
        [`${vehicle_device}.is_active`]: true,
        [`${alert_data}.msg_type`]: 'A',
      })
      .andWhere(`${searchType}`, 'ILIKE', `%${searchString}%`)
      .orderBy(`${alert_data}.date`, `desc`)
      .limit(limit)
      .offset(offset);
  }

  // post devices , for device join
  async postDevices(device_name: string, device_eui: string) {
    return await this.knex(tables.DEVICES).insert({ device_name, device_eui });
  }

  ////---- counting ----////
  // get count data , /alert_data
  async getCountingAlertData(msgType: string | null) {
    if (msgType == null) {
      return await this.knex
        .count<[{ count: number }]>(`${alert_data}.id`)
        .from(alert_data)
        .leftJoin(devices, `${devices}.id`, `${alert_data}.device_id`)
        .leftJoin(vehicle_device, `${vehicle_device}.device_id`, `${devices}.id`)
        .leftJoin(vehicles, `${vehicles}.id`, `${vehicle_device}.vehicle_id`)
        .leftJoin(company_vehicles, `${company_vehicles}.vehicle_id`, `${vehicles}.id`)
        .leftJoin(companies, `${companies}.id`, `${company_vehicles}.company_id`)
        .where({
          [`${companies}.is_active`]: true,
          [`${devices}.is_active`]: true,
          [`${alert_data}.is_active`]: true,
          [`${vehicles}.is_active`]: true,
          [`${company_vehicles}.is_active`]: true,
          [`${vehicle_device}.is_active`]: true,
        });
    } else {
      return await this.knex
        .count<[{ count: number }]>(`${alert_data}.id`)
        .from(alert_data)
        .leftJoin(devices, `${devices}.id`, `${alert_data}.device_id`)
        .leftJoin(vehicle_device, `${vehicle_device}.device_id`, `${devices}.id`)
        .leftJoin(vehicles, `${vehicles}.id`, `${vehicle_device}.vehicle_id`)
        .leftJoin(company_vehicles, `${company_vehicles}.vehicle_id`, `${vehicles}.id`)
        .leftJoin(companies, `${companies}.id`, `${company_vehicles}.company_id`)
        .where({
          [`${companies}.is_active`]: true,
          [`${devices}.is_active`]: true,
          [`${alert_data}.is_active`]: true,
          [`${vehicles}.is_active`]: true,
          [`${company_vehicles}.is_active`]: true,
          [`${vehicle_device}.is_active`]: true,
          [`${alert_data}.msg_type`]: msgType,
        });
    }
  }
  // get count data by searching, /alert_data
  async getCountingAlertDataBySearch(searchType: string, searchString: string) {
    return await this.knex(alert_data)
      .leftJoin(devices, `${devices}.id`, `${alert_data}.device_id`)
      .leftJoin(vehicle_device, `${vehicle_device}.device_id`, `${devices}.id`)
      .leftJoin(vehicles, `${vehicles}.id`, `${vehicle_device}.vehicle_id`)
      .leftJoin(company_vehicles, `${company_vehicles}.vehicle_id`, `${vehicles}.id`)
      .leftJoin(companies, `${companies}.id`, `${company_vehicles}.company_id`)
      .where({
        [`${companies}.is_active`]: true,
        [`${devices}.is_active`]: true,
        [`${alert_data}.is_active`]: true,
        [`${vehicles}.is_active`]: true,
        [`${company_vehicles}.is_active`]: true,
        [`${vehicle_device}.is_active`]: true,
        [`${alert_data}.msg_type`]: 'A',
      })
      .andWhere(`${searchType}`, 'ILIKE', `%${searchString}%`)
      .count(`${alert_data}.id`);
  }
  // get count data by searhing date, /alert_data
  async getCountingAlertDataBySearchDate(date: string, nextDate: string) {
    return await this.knex(alert_data)
      .leftJoin(devices, `${devices}.id`, `${alert_data}.device_id`)
      .leftJoin(vehicle_device, `${vehicle_device}.device_id`, `${devices}.id`)
      .leftJoin(vehicles, `${vehicles}.id`, `${vehicle_device}.vehicle_id`)
      .leftJoin(company_vehicles, `${company_vehicles}.vehicle_id`, `${vehicles}.id`)
      .leftJoin(companies, `${companies}.id`, `${company_vehicles}.company_id`)
      .where({
        [`${companies}.is_active`]: true,
        [`${devices}.is_active`]: true,
        [`${alert_data}.is_active`]: true,
        [`${vehicles}.is_active`]: true,
        [`${company_vehicles}.is_active`]: true,
        [`${vehicle_device}.is_active`]: true,
        [`${alert_data}.msg_type`]: 'A',
      })
      .andWhereRaw(
        `${alert_data}.date >= ${date} 00:00:00 AND ${alert_data}.date < ${nextDate} 00:00:00`
      )
      .count(`${alert_data}.id`);
  }

  ////---- others ----////
  // get device id to confirm
  async getDevicesID(reqEUI: string) {
    return await this.knex
      .select<{ id: number }>('id')
      .from(devices)
      .where({ device_eui: reqEUI })
      .first();
  }

  // check duplicate #company_name
  async checkCompanyDuplicate(company_name: string) {
    return await this.knex(companies)
      .where(`company_name`, 'ILIKE', `${company_name}`)
      .andWhere(`is_active`, true)
      .select<{ id: number }[]>('id');
  }
  // check duplicate #car_plate
  async checkCarPlateDuplicate(car_plate: string) {
    return await this.knex(vehicles)
      .where(`car_plate`, 'ILIKE', `${car_plate}`)
      .andWhere('is_active', true)
      .select<{ id: number }[]>('id');
  }

  //// 20210802 edit / delete companies & vehicles
  async putCompanies(id: number, company_name: string, tel: string, contact_person: string) {
    return await this.knex(companies)
      .where({ id: id, is_active: true })
      .update({ company_name, tel, contact_person, updated_at: new Date(Date.now()) });
  }
  async putVehicles(id: number, car_plate: string, vehicle_model: string, vehicle_type: string) {
    return await this.knex(vehicles)
      .where({ id: id, is_active: true })
      .update({ car_plate, vehicle_model, vehicle_type, updated_at: new Date(Date.now()) });
  }
  async deleteCompanies(id: number[]) {
    return await this.knex(companies)
      .whereIn('id', id)
      .update({ is_active: false, updated_at: new Date(Date.now()) })
      .returning<number[]>('id');
  } // delete#companies 1
  async deleteVehicles(id: number[]) {
    return await this.knex(vehicles)
      .whereIn('id', id)
      .update({ is_active: false, updated_at: new Date(Date.now()) })
      .returning<number[]>('id');
  } // delete#vehicles 1 || delete#companies 3
  async deleteCompanyVehicles(id: number[], table: string) {
    let whereField, returnField;
    switch (table) {
      case vehicles:
        whereField = 'vehicle_id';
        returnField = 'company_id';
        break;
      case companies:
        whereField = 'company_id';
        returnField = 'vehicle_id';
        break;
    }
    return await this.knex(company_vehicles)
      .whereIn(`${whereField}`, id)
      .andWhere('is_active', true)
      .update({
        is_active: false,
        updated_at: new Date(Date.now()),
      })
      .returning<number[]>(`${returnField}`);
  } // delete#vehicles 2 || delete#companies 2
  async deleteVehicleDevice(id: number[], table: string) {
    let query;
    switch (table) {
      case devices:
        query = this.knex(vehicle_device)
          .whereIn('device_id', id)
          .andWhere('is_active', true)
          .update({
            is_active: false,
            updated_at: new Date(Date.now()),
          });
        break;
      default:
        query = this.knex(vehicle_device)
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
    return await this.knex(devices)
      .whereIn('id', id)
      .update({ is_active: false, updated_at: new Date(Date.now()) })
      .returning<number[]>('id');
  } // delete#devices 1
}
