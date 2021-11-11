import { Knex } from 'knex';
import { IAlertData, IDataHistory, ILocationDetail, msgType } from '../models/models';
import { setTimeToDateEnd, setTimeToDateStart } from '../utils/helperFunctions';
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
    data: string,
    rssi?: number,
    snr?: number
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
        rssi,
        snr,
      })
      .returning<number[]>('id');
  };

  getData = async (
    devicesList: number[] | null,
    id: number | null,
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
        rssi: `${tables.ALERT_DATA}.rssi`,
        snr: `${tables.ALERT_DATA}.snr`,
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
        setTimeToDateStart(new Date(startDate!)),
        !!endDate ? setTimeToDateEnd(new Date(endDate)) : new Date().toISOString(),
      ]);
    };

    if (!!id) query.andWhere(`${tables.ALERT_DATA}.id`, id);
    if (!!searchString) query.andWhere(searchQuery);
    if (!!startDate) query.andWhere(dateQuery);
    if (!!devicesList) query.whereIn(`${tables.ALERT_DATA}.device_id`, devicesList);
    if (!!msgType) {
      msgType === 'A'
        ? query.andWhere(`${tables.ALERT_DATA}.msg_type`, msgType)
        : query.andWhereNot(`${tables.ALERT_DATA}.msg_type`, msgType);
    }
    return await query.paginate<IAlertData[]>({ perPage, currentPage, isLengthAware: true });
  };

  getLatestLocations = async (devicesList: number[] | null) => {
    const d = new Date();
    d.setHours(d.getHours() - 168);

    const query = this.knex(tables.ALERT_DATA)
      .distinctOn(`${tables.ALERT_DATA}.device_id`)
      .select<ILocationDetail[]>({
        deviceId: `${tables.ALERT_DATA}.device_id`,
        deviceName: `${tables.DEVICES}.device_name`,
        deviceEui: `${tables.DEVICES}.device_eui`,
        date: `${tables.ALERT_DATA}.date`,
        geolocation: `${tables.ALERT_DATA}.geolocation`,
        msgType: `${tables.ALERT_DATA}.msg_type`,
        battery: `${tables.ALERT_DATA}.battery`,
        rssi: `${tables.ALERT_DATA}.rssi`,
        snr: `${tables.ALERT_DATA}.snr`,
        carPlate: `${tables.VEHICLES}.car_plate`,
        companyName: `${tables.COMPANIES}.company_name`,
      })
      .innerJoin(tables.DEVICES, `${tables.ALERT_DATA}.device_id`, `${tables.DEVICES}.id`)
      .leftJoin(tables.VEHICLE_DEVICE, `${tables.DEVICES}.id`, `${tables.VEHICLE_DEVICE}.device_id`)
      .leftJoin(tables.VEHICLES, `${tables.VEHICLES}.id`, `${tables.VEHICLE_DEVICE}.vehicle_id`)
      .leftJoin(
        tables.COMPANY_VEHICLES,
        `${tables.COMPANY_VEHICLES}.vehicle_id`,
        `${tables.VEHICLES}.id`
      )
      .leftJoin(tables.COMPANIES, `${tables.COMPANY_VEHICLES}.company_id`, `${tables.COMPANIES}.id`)
      .where({
        [`${tables.ALERT_DATA}.is_active`]: true,
        [`${tables.DEVICES}.is_active`]: true,
      })
      .andWhereBetween(`${tables.ALERT_DATA}.date`, [d, new Date()])
      .andWhereNot(`${tables.ALERT_DATA}.address`, 'GPS NOT FOUND')
      .orderBy([
        { column: `${tables.ALERT_DATA}.device_id`, order: 'asc' },
        { column: `${tables.ALERT_DATA}.date`, order: 'desc' },
      ]);

    if (!!devicesList) query.whereIn(`${tables.ALERT_DATA}.device_id`, devicesList);
    return await query;
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
    const dateQuery = (builder: Knex.QueryBuilder) => {
      builder.whereBetween(`${tables.ALERT_DATA}.date`, [
        setTimeToDateStart(!!date ? new Date(date) : new Date()),
        setTimeToDateEnd(!!date ? new Date(date) : new Date()),
      ]);
    };

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
      .andWhere(dateQuery)
      .andWhereNot(`${tables.ALERT_DATA}.address`, 'GPS NOT FOUND')
      .orderBy('date', 'desc');
  };

  getLowBatteryNotifications = async (BATTERY_MIN: number, devicesList: number[] | null) => {
    const tempAlertDataTable = 'temp_alert_data';

    const query = this.knex
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

    if (!!devicesList) query.whereIn(`${tempAlertDataTable}.deviceId`, devicesList);
    return await query;
  };

  updateNotificationsStatus = async (notificationIds: number[]) => {
    const tempDevicesTable = 'temp_devices';

    return await this.knex(tables.ALERT_DATA)
      .with(tempDevicesTable, (qb) => {
        qb.select('device_id')
          .from(tables.ALERT_DATA)
          .leftJoin(tables.DEVICES, `${tables.ALERT_DATA}.device_id`, `${tables.DEVICES}.id`)
          .where({
            [`${tables.ALERT_DATA}.is_active`]: true,
            [`${tables.ALERT_DATA}.is_read`]: false,
            [`${tables.DEVICES}.is_active`]: true,
          })
          .whereIn(`${tables.ALERT_DATA}.id`, notificationIds);
      })
      .update(
        {
          is_read: true,
          updated_at: new Date(Date.now()),
        },
        ['id']
      )
      .whereIn('id', notificationIds)
      .orWhereIn('device_id', (builder) => {
        builder.select('*').from(tempDevicesTable);
      })
      .andWhere({
        is_read: false,
        is_active: true,
      });
  };
}
