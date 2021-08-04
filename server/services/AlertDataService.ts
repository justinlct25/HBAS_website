import { Knex } from 'knex';
import { tables } from './../utils/table_model';

export class AlertDataService {
  constructor(private knex: Knex) {}

  getLatestLocations = async () => {
    const d = new Date();
    d.setHours(d.getHours() - 24);

    return await this.knex(tables.ALERT_DATA)
      .distinctOn(`${tables.ALERT_DATA}.device_id`)
      .select({
        deviceId: `${tables.ALERT_DATA}.device_id`,
        deviceName: `${tables.DEVICES}.device_name`,
        deviceEui: `${tables.DEVICES}.device_eui`,
        date: `${tables.ALERT_DATA}.date`,
        geolocation: `${tables.ALERT_DATA}.geolocation`,
        msgType: `${tables.ALERT_DATA}.msg_type`,
        battery: `${tables.ALERT_DATA}.battery`,
        carPlate: `${tables.VEHICLES}.car_plate`,
        companyName: `${tables.COMPANIES}.company_name`,
      })
      .innerJoin(tables.DEVICES, `${tables.ALERT_DATA}.device_id`, `${tables.DEVICES}.id`)
      .innerJoin(
        tables.VEHICLE_DEVICE,
        `${tables.DEVICES}.id`,
        `${tables.VEHICLE_DEVICE}.device_id`
      )
      .innerJoin(tables.VEHICLES, `${tables.VEHICLES}.id`, `${tables.VEHICLE_DEVICE}.vehicle_id`)
      .innerJoin(
        tables.COMPANY_VEHICLES,
        `${tables.COMPANY_VEHICLES}.vehicle_id`,
        `${tables.VEHICLES}.id`
      )
      .innerJoin(
        tables.COMPANIES,
        `${tables.COMPANY_VEHICLES}.company_id`,
        `${tables.COMPANIES}.id`
      )
      .where({
        [`${tables.ALERT_DATA}.is_active`]: true,
        [`${tables.DEVICES}.is_active`]: true,
        [`${tables.VEHICLE_DEVICE}.is_active`]: true,
        [`${tables.VEHICLES}.is_active`]: true,
        [`${tables.COMPANY_VEHICLES}.is_active`]: true,
        [`${tables.COMPANIES}.is_active`]: true,
      })
      .andWhereBetween(`${tables.ALERT_DATA}.date`, [d, new Date()]);
  };

  getDatesWithMessages = async (deviceId: number) => {
    return await this.knex(tables.ALERT_DATA)
      .select({
        day: this.knex.raw(`date_trunc('day', date)`),
      })
      .count('device_id AS messageCount')
      .where({
        is_active: true,
        device_id: deviceId,
      })
      .groupBy('day')
      .orderBy('day', 'desc');
  };
}
