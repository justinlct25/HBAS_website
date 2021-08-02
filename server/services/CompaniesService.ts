import { tables } from './../utils/table_model';
import { Knex } from 'knex';

export class CompaniesService {
  constructor(private knex: Knex) {}

  getCompanyVehicles = async (companyId: number) => {
    const tempVehicles = 'temp_vehicles';
    const tempDevices = 'temp_devices';

    return await this.knex
      .with(tempVehicles, (qb) => {
        qb.distinct({
          vehicleId: `${tables.VEHICLES}.id`,
          carPlate: `${tables.VEHICLES}.car_plate`,
          vehicleModel: `${tables.VEHICLES}.vehicle_model`,
          vehicleType: `${tables.VEHICLES}.vehicle_type`,
          updatedAt: `${tables.VEHICLES}.updated_at`,
        })
          .from(tables.VEHICLES)
          .innerJoin(
            tables.COMPANY_VEHICLES,
            `${tables.VEHICLES}.id`,
            `${tables.COMPANY_VEHICLES}.vehicle_id`
          )
          .where({
            [`${tables.VEHICLES}.is_active`]: true,
            [`${tables.COMPANY_VEHICLES}.is_active`]: true,
            [`${tables.COMPANY_VEHICLES}.company_id`]: companyId,
          });
      })
      .with(tempDevices, (qb) => {
        qb.distinct({
          vehicleId: `${tables.VEHICLE_DEVICE}.vehicle_id`,
          deviceId: `${tables.DEVICES}.id`,
          deviceName: `${tables.DEVICES}.device_name`,
          deviceEui: `${tables.DEVICES}.device_eui`,
        })
          .from(tables.DEVICES)
          .innerJoin(
            tables.VEHICLE_DEVICE,
            `${tables.VEHICLE_DEVICE}.device_id`,
            `${tables.DEVICES}.id`
          )
          .where({
            [`${tables.DEVICES}.is_active`]: true,
            [`${tables.VEHICLE_DEVICE}.is_active`]: true,
          });
      })
      .select([
        `${tempVehicles}.*`,
        `${tempDevices}.deviceId`,
        `${tempDevices}.deviceName`,
        `${tempDevices}.deviceEui`,
      ])
      .from(tempVehicles)
      .leftJoin(tempDevices, `${tempVehicles}.vehicleId`, `${tempDevices}.vehicleId`)
      .orderBy([
        { column: `${tempVehicles}.updatedAt`, order: 'desc' },
        { column: `${tempVehicles}.carPlate`, order: 'asc' },
      ]);
  };
}
