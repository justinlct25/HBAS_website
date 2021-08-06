import { Knex } from 'knex';
import { IDeviceDetail, IDeviceInfo } from '../models/models';
import { logger } from '../utils/logger';
import { tables } from './../utils/table_model';

export class DevicesService {
  constructor(private knex: Knex) {}

  getAllDevices = async (perPage: number, currentPage: number, searchString: string | null) => {
    const tempVehicles = 'temp_vehicles';
    const tempCompanies = 'temp_companies';
    const tempVehicleDevice = 'temp_vehicle_device';
    const tempCompaniesVehicles = 'temp_companies_vehicles';

    const query = this.knex
      .with(tempVehicles, (qb) => {
        qb.select('id', 'car_plate').from(tables.VEHICLES).where('is_active', true);
      })
      .with(tempCompanies, (qb) => {
        qb.select('id', 'company_name', 'tel', 'contact_person')
          .from(tables.COMPANIES)
          .where('is_active', true);
      })
      .with(tempVehicleDevice, (qb) => {
        qb.select('device_id', 'vehicle_id').from(tables.VEHICLE_DEVICE).where('is_active', true);
      })
      .with(tempCompaniesVehicles, (qb) => {
        qb.select('company_id', 'vehicle_id')
          .from(tables.COMPANY_VEHICLES)
          .where('is_active', true);
      })
      .distinct<IDeviceDetail[]>({
        deviceId: `${tables.DEVICES}.id`,
        deviceName: `${tables.DEVICES}.device_name`,
        deviceEui: `${tables.DEVICES}.device_eui`,
        vehicleId: `${tempVehicles}.id`,
        carPlate: `${tempVehicles}.car_plate`,
        companyId: `${tempCompanies}.id`,
        companyName: `${tempCompanies}.company_name`,
        tel: `${tempCompanies}.tel`,
        contactPerson: `${tempCompanies}.contact_person`,
        updatedAt: `${tables.DEVICES}.updated_at`,
      })
      .from(tables.DEVICES)
      .leftJoin(tempVehicleDevice, `${tables.DEVICES}.id`, `${tempVehicleDevice}.device_id`)
      .leftJoin(tempVehicles, `${tempVehicles}.id`, `${tempVehicleDevice}.vehicle_id`)
      .leftJoin(tempCompaniesVehicles, `${tempCompaniesVehicles}.vehicle_id`, `${tempVehicles}.id`)
      .leftJoin(tempCompanies, `${tempCompaniesVehicles}.company_id`, `${tempCompanies}.id`)
      .where({
        [`${tables.DEVICES}.is_active`]: true,
      })
      .orderBy([
        { column: `${tables.DEVICES}.updated_at`, order: 'desc' },
        { column: `${tables.DEVICES}.device_name`, order: 'asc' },
      ]);

    const searchQuery = (builder: Knex.QueryBuilder) => {
      builder
        .where(`${tempCompanies}.company_name`, 'ILIKE', searchString)
        .orWhere(`${tempCompanies}.tel`, 'ILIKE', searchString)
        .orWhere(`${tempCompanies}.contact_person`, 'ILIKE', searchString)
        .orWhere(`${tables.DEVICES}.device_name`, 'ILIKE', searchString)
        .orWhere(`${tables.DEVICES}.device_eui`, 'ILIKE', searchString)
        .orWhere(`${tables.VEHICLES}.car_plate`, 'ILIKE', searchString);
    };

    if (!!searchString) query.andWhere(searchQuery);
    return await query.paginate<IDeviceDetail[]>({ perPage, currentPage, isLengthAware: true });
  };

  getDevicesForLinking = async (deviceId: number | null) => {
    const query = () => {
      return this.knex(tables.DEVICES)
        .distinct<IDeviceInfo[]>({ id: 'id', deviceName: 'device_name', deviceEui: 'device_eui' })
        .where('is_active', true)
        .andWhereNot('id', deviceId)
        .orderBy('device_eui');
    };

    const filterQuery = (builder: Knex.QueryBuilder) => {
      builder
        .select('device_id')
        .from(tables.VEHICLE_DEVICE)
        .whereRaw(/* SQL*/ `${tables.DEVICES}.id = ${tables.VEHICLE_DEVICE}.device_id`)
        .andWhere('is_active', true);
    };

    return {
      linkedDevices: await query().whereExists(filterQuery),
      newDevices: await query().whereNotExists(filterQuery),
    };
  };

  linkDeviceAndVehicle = async (deviceId: number, vehicleId: number) => {
    const trx = await this.knex.transaction();
    try {
      // unlink existing pairs (if exists)
      await trx(tables.VEHICLE_DEVICE)
        .update({
          is_active: false,
          updated_at: new Date(Date.now()),
        })
        .where((builder) => {
          builder.where('device_id', deviceId).orWhere('vehicle_id', vehicleId);
        })
        .andWhere('is_active', true);

      // delete and insert device as a new one
      const deviceDetails = await trx(tables.DEVICES)
        .update(
          {
            is_active: false,
            updated_at: new Date(Date.now()),
          },
          ['device_name', 'device_eui', 'version']
        )
        .where('id', deviceId);

      const newDeviceId = await trx(tables.DEVICES).insert(deviceDetails).returning<number[]>('id');

      // link up new device and vehicle
      const ids = await trx(tables.VEHICLE_DEVICE)
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
