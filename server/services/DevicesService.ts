import { ROLES } from './../utils/variables';
import { Knex } from 'knex';
import { IDeviceDetail, IDeviceInfo } from '../models/models';
import { logger } from '../utils/logger';
import { tables } from './../utils/table_model';

const { DEVICES, COMPANY_VEHICLES, VEHICLE_DEVICE, COMPANIES, VEHICLES, USERS, USER_DEVICES } =
  tables;

export class DevicesService {
  constructor(private knex: Knex) {}

  getAllDevices = async (
    devicesList: number[] | null,
    perPage: number,
    currentPage: number,
    searchString: string | null
  ) => {
    const query = this.knex
      .distinct<IDeviceDetail[]>({
        deviceId: `${DEVICES}.id`,
        deviceName: `${DEVICES}.device_name`,
        deviceEui: `${DEVICES}.device_eui`,
        deviceIsActive: `${DEVICES}.is_active`,
        vehicleId: `${VEHICLES}.id`,
        carPlate: `${VEHICLES}.car_plate`,
        vehicleIsActive: `${VEHICLES}.is_active`,
        companyId: `${COMPANIES}.id`,
        companyName: `${COMPANIES}.company_name`,
        tel: `${COMPANIES}.tel`,
        contactPerson: `${COMPANIES}.contact_person`,
        companyIsActive: `${COMPANIES}.is_active`,
        updatedAt: `${DEVICES}.updated_at`,
      })
      .from(DEVICES)
      .leftJoin(VEHICLE_DEVICE, `${DEVICES}.id`, `${VEHICLE_DEVICE}.device_id`)
      .leftJoin(VEHICLES, `${VEHICLES}.id`, `${VEHICLE_DEVICE}.vehicle_id`)
      .leftJoin(COMPANY_VEHICLES, `${COMPANY_VEHICLES}.vehicle_id`, `${VEHICLES}.id`)
      .leftJoin(COMPANIES, `${COMPANY_VEHICLES}.company_id`, `${COMPANIES}.id`)
      .orderBy([
        { column: `${DEVICES}.updated_at`, order: 'desc' },
        { column: `${DEVICES}.device_name`, order: 'asc' },
      ]);

    const searchQuery = (builder: Knex.QueryBuilder) => {
      builder
        .where(`${COMPANIES}.company_name`, 'ILIKE', searchString)
        .orWhere(`${COMPANIES}.tel`, 'ILIKE', searchString)
        .orWhere(`${COMPANIES}.contact_person`, 'ILIKE', searchString)
        .orWhere(`${DEVICES}.device_name`, 'ILIKE', searchString)
        .orWhere(`${DEVICES}.device_eui`, 'ILIKE', searchString)
        .orWhere(`${VEHICLES}.car_plate`, 'ILIKE', searchString);
    };

    if (!!searchString) query.andWhere(searchQuery);
    if (!!devicesList) query.whereIn(`${DEVICES}.id`, devicesList);
    return await query.paginate<IDeviceDetail[]>({ perPage, currentPage, isLengthAware: true });
  };

  getDeviceDetails = async (device_eui: string) => {
    return await this.knex(DEVICES)
      .select<IDeviceInfo>({
        id: 'id',
        deviceName: 'device_name',
        deviceEui: 'device_eui',
        version: 'version',
      })
      .where({
        device_eui,
        is_active: true,
      })
      .first();
  };

  getDevicesForLinking = async (deviceId: number | null) => {
    const query = () => {
      return this.knex(DEVICES)
        .distinct<IDeviceInfo[]>({ id: 'id', deviceName: 'device_name', deviceEui: 'device_eui' })
        .where('is_active', true)
        .andWhereNot('id', deviceId)
        .orderBy('device_eui');
    };

    const filterQuery = (builder: Knex.QueryBuilder) => {
      builder
        .select<{ device_id: number }>('device_id')
        .from(VEHICLE_DEVICE)
        .whereRaw(/* SQL*/ `${DEVICES}.id = ${VEHICLE_DEVICE}.device_id`)
        .andWhere('is_active', true);
    };

    return {
      linkedDevices: await query().whereExists(filterQuery),
      newDevices: await query().whereNotExists(filterQuery),
    };
  };

  addDevice = async (device_name: string, device_eui: string) => {
    const trx = await this.knex.transaction();
    try {
      const deviceId = await trx(DEVICES)
        .insert({ device_name, device_eui })
        .returning<number[]>('id');
      const admins = await trx(USERS).select<{ id: number }[]>('id').where('role', ROLES.ADMIN);

      await trx(USER_DEVICES).insert(
        admins.map((admin) => ({
          device_id: deviceId[0],
          user_id: admin.id,
        }))
      );

      await trx.commit();
      return deviceId;
    } catch (e) {
      logger.error(e.message);
      await trx.rollback();
      return;
    }
  };

  updateDevice = async (deviceId: number, device_name: string) => {
    return await this.knex(DEVICES)
      .update({ device_name })
      .where('id', deviceId)
      .returning<number[]>('id');
  };

  linkDeviceAndVehicle = async (deviceId: number, vehicleId: number) => {
    const trx = await this.knex.transaction();
    try {
      // unlink existing pairs (if exists)
      await trx(VEHICLE_DEVICE)
        .update({
          is_active: false,
          updated_at: new Date(Date.now()),
        })
        .where((builder) => {
          builder.where('device_id', deviceId).orWhere('vehicle_id', vehicleId);
        })
        .andWhere('is_active', true);

      // delete and insert device as a new one
      const deviceDetails = await trx(DEVICES)
        .update(
          {
            is_active: false,
            updated_at: new Date(Date.now()),
          },
          ['device_name', 'device_eui', 'version']
        )
        .where('id', deviceId);

      const newDeviceId = await trx(DEVICES).insert(deviceDetails).returning<number[]>('id');
      const admins = await trx(USERS).select<{ id: number }[]>('id').where('role', ROLES.ADMIN);

      // assign new devices to admins
      await trx(USER_DEVICES).insert(
        admins.map((admin) => ({
          device_id: newDeviceId[0],
          user_id: admin.id,
        }))
      );

      // link up new device and vehicle
      const ids = await trx(VEHICLE_DEVICE)
        .insert({
          device_id: newDeviceId[0],
          vehicle_id: vehicleId,
        })
        .returning<number[]>('id');

      await trx.commit();
      return ids;
    } catch (e) {
      logger.error(e.message);
      await trx.rollback();
      return;
    }
  };
}
