import { Knex } from 'knex';
import { IAlertData, IDataHistory, ILocationDetail, msgType } from '../models/models';
import { BATTERY_MIN } from '../utils/variables';
import { tables } from './../utils/table_model';

export class AlertDataService {
  constructor(private knex: Knex) {}

  postData = async (
    device_id: number,
    date: string,
    geolocation: string,
    address: string,
    msg_type: string,
    battery: string,
    data: string
  ) => {
    return await this.knex(tables.ALERT_DATA)
      .insert({
        device_id,
        date,
        geolocation,
        address,
        msg_type,
        battery,
        data,
      })
      .returning<number[]>('id');
  };

  getData = async (
    msgType: msgType | null,
    perPage: number,
    currentPage: number,
    searchString: string | null,
    startDate: string | null,
    endDate: string | null
  ) => {
    const query = this.knex
      .select<IAlertData[]>({
        id: `${tables.ALERT_DATA}.id`,
        date: `${tables.ALERT_DATA}.date`,
        geolocation: `${tables.ALERT_DATA}.geolocation`,
        address: `${tables.ALERT_DATA}.address`,
        msgType: `${tables.ALERT_DATA}.msg_type`,
        battery: `${tables.ALERT_DATA}.battery`,
        receivedAt: `${tables.ALERT_DATA}.created_at`,
        deviceId: `${tables.ALERT_DATA}.device_id`,
        deviceName: `${tables.DEVICES}.device_name`,
        deviceEui: `${tables.DEVICES}.device_eui`,
        deviceVersion: `${tables.DEVICES}.version`,
        deviceIsActive: `${tables.DEVICES}.is_active`,
        vehicleId: `${tables.VEHICLES}.id`,
        carPlate: `${tables.VEHICLES}.car_plate`,
        vehicleIsActive: `${tables.VEHICLES}.is_active`,
        companyId: `${tables.COMPANIES}.id`,
        companyName: `${tables.COMPANIES}.company_name`,
        companyTel: `${tables.COMPANIES}.tel`,
        companyContactPerson: `${tables.COMPANIES}.contact_person`,
        companyIsActive: `${tables.COMPANIES}.is_active`,
      })
      .from(tables.ALERT_DATA)
      .leftJoin(tables.DEVICES, `${tables.ALERT_DATA}.device_id`, `${tables.DEVICES}.id`)
      .leftJoin(tables.VEHICLE_DEVICE, `${tables.DEVICES}.id`, `${tables.VEHICLE_DEVICE}.device_id`)
      .leftJoin(tables.VEHICLES, `${tables.VEHICLES}.id`, `${tables.VEHICLE_DEVICE}.vehicle_id`)
      .leftJoin(
        tables.COMPANY_VEHICLES,
        `${tables.COMPANY_VEHICLES}.vehicle_id`,
        `${tables.VEHICLES}.id`
      )
      .leftJoin(tables.COMPANIES, `${tables.COMPANY_VEHICLES}.company_id`, `${tables.COMPANIES}.id`)
      .where(`${tables.ALERT_DATA}.is_active`, true)
      .orderBy(`${tables.ALERT_DATA}.date`, 'desc');

    const searchQuery = (builder: Knex.QueryBuilder) => {
      builder
        .where(`${tables.ALERT_DATA}.address`, 'ILIKE', searchString)
        .orWhere(`${tables.DEVICES}.device_name`, 'ILIKE', searchString)
        .orWhere(`${tables.DEVICES}.device_eui`, 'ILIKE', searchString)
        .orWhere(`${tables.DEVICES}.version`, 'ILIKE', searchString)
        .orWhere(`${tables.VEHICLES}.car_plate`, 'ILIKE', searchString)
        .orWhere(`${tables.COMPANIES}.company_name`, 'ILIKE', searchString)
        .orWhere(`${tables.COMPANIES}.tel`, 'ILIKE', searchString);
    };

    const dateQuery = (builder: Knex.QueryBuilder) => {
      builder.whereBetween(`${tables.ALERT_DATA}.date`, [
        new Date(`${startDate} 00:00:00`).toISOString(),
        !!endDate ? new Date(`${endDate} 23:59:59`).toISOString() : new Date().toISOString(),
      ]);
    };

    if (!!msgType) query.andWhere(`${tables.ALERT_DATA}.msg_type`, msgType.toUpperCase());
    if (!!searchString) query.andWhere(searchQuery);
    if (!!startDate) query.andWhere(dateQuery);
    return await query.paginate<IAlertData[]>({ perPage, currentPage, isLengthAware: true });
  };

  getLatestLocations = async () => {
    const d = new Date();
    d.setHours(d.getHours() - 24);

    return await this.knex(tables.ALERT_DATA)
      .distinctOn(`${tables.ALERT_DATA}.device_id`)
      .select<ILocationDetail[]>({
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
      .andWhereBetween(`${tables.ALERT_DATA}.date`, [d, new Date()])
      .orderBy([
        { column: `${tables.ALERT_DATA}.device_id`, order: 'asc' },
        { column: `${tables.ALERT_DATA}.date`, order: 'desc' },
      ]);
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

  getHistoryByDeviceAndDate = async (deviceId: number, date: string | null) => {
    return await this.knex(tables.ALERT_DATA)
      .select<IDataHistory[]>({
        id: 'id',
        deviceId: 'device_id',
        geolocation: 'geolocation',
        date: 'date',
        address: 'address',
        msgType: 'msg_type',
        battery: 'battery',
      })
      .where({
        is_active: true,
        device_id: deviceId,
      })
      .andWhereRaw(`date_trunc('day', date) = ?`, [
        !!date
          ? new Date(`${date} 00:00:00`).toISOString()
          : new Date(`${new Date(Date.now()).toLocaleDateString('en-CA')} 00:00:00`).toISOString(),
      ])
      .orderBy('date', 'desc');
  };

  getLowBatteryNotifications = async () => {
    const tempAlertDataTable = 'temp_alert_data';

    return await this.knex
      .with(tempAlertDataTable, (qb) => {
        qb.from(tables.ALERT_DATA)
          .distinctOn(`${tables.ALERT_DATA}.device_id`)
          .select({
            id: `${tables.ALERT_DATA}.id`,
            deviceId: `${tables.ALERT_DATA}.device_id`,
            deviceName: `${tables.DEVICES}.device_name`,
            deviceEui: `${tables.DEVICES}.device_eui`,
            date: `${tables.ALERT_DATA}.date`,
            battery: `${tables.ALERT_DATA}.battery`,
          })
          .leftJoin(tables.DEVICES, `${tables.ALERT_DATA}.device_id`, `${tables.DEVICES}.id`)
          .where({
            [`${tables.ALERT_DATA}.is_active`]: true,
            [`${tables.ALERT_DATA}.is_read`]: false,
            [`${tables.DEVICES}.is_active`]: true,
          })
          .andWhere(`${tables.ALERT_DATA}.battery`, '<=', BATTERY_MIN)
          .orderBy([
            { column: `${tables.ALERT_DATA}.device_id`, order: 'asc' },
            { column: `${tables.ALERT_DATA}.date`, order: 'desc' },
          ]);
      })
      .select('*')
      .from(tempAlertDataTable)
      .orderBy([
        { column: `${tempAlertDataTable}.date`, order: 'desc' },
        { column: `${tempAlertDataTable}.deviceName`, order: 'asc' },
      ]);
  };

  updateNotificationsStatus = async (notificationIds: number[]) => {
    return await this.knex(tables.ALERT_DATA)
      .update(
        {
          is_read: true,
          updated_at: new Date(Date.now()),
        },
        ['id']
      )
      .whereIn('id', notificationIds)
      .andWhere({
        is_read: false,
        is_active: true,
      });
  };
}
