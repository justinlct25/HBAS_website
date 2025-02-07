import { Knex } from 'knex';
import { INewVehicle, IVehicleDetail } from '../models/models';
import { logger } from '../utils/logger';
import { tables } from './../utils/table_model';

export class VehiclesService {
  constructor(private knex: Knex) {}

  getCompanyVehicles = async (companyId: number) => {
    const tempVehicles = 'temp_vehicles';
    const tempDevices = 'temp_devices';

    return await this.knex
      .with(tempVehicles, (qb) => {
        qb.distinct({
          vehicleId: `${tables.VEHICLES}.id`,
          carPlate: `${tables.VEHICLES}.car_plate`,
          manufacturer: `${tables.VEHICLES}.manufacturer`,
          vehicleModel: `${tables.VEHICLES}.vehicle_model`,
          vehicleType: `${tables.VEHICLES}.vehicle_type`,
          manufactureYear: `${tables.VEHICLES}.manufacture_year`,
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
      .select<IVehicleDetail[]>([
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

  checkExistingVehicles = async (carPlates: string[]) => {
    return await this.knex(tables.VEHICLES)
      .distinct<{ id: number; car_plate: string }[]>(['id', 'car_plate'])
      .where('is_active', true)
      .whereIn(
        'car_plate',
        carPlates.map((v) => v.toUpperCase())
      );
  };

  addVehicles = async (vehicles: INewVehicle[], companyId: number) => {
    const trx = await this.knex.transaction();
    try {
      const ids = await trx(tables.VEHICLES)
        .insert(
          vehicles.map((v) => ({
            car_plate: v.carPlate.toUpperCase(),
            manufacturer: v.manufacturer,
            vehicle_model: v.vehicleModel,
            vehicle_type: v.vehicleType,
            manufacture_year: v.manufactureYear,
          }))
        )
        .returning<number[]>('id');

      await trx(tables.COMPANY_VEHICLES).insert(
        ids.map((id) => ({
          company_id: companyId,
          vehicle_id: id,
        }))
      );

      await trx.commit();
      return ids;
    } catch (e) {
      logger.error(e.message);
      await trx.rollback();
      return;
    }
  };

  editVehicle = async (
    vehicleId: number,
    carPlate: string,
    manufacturer: string | null,
    vehicleModel: string | null,
    vehicleType: string | null,
    manufactureYear: string | null
  ) => {
    return await this.knex(tables.VEHICLES)
      .update(
        {
          car_plate: carPlate.toUpperCase(),
          manufacturer,
          vehicle_model: vehicleModel,
          vehicle_type: vehicleType,
          manufacture_year: manufactureYear,
          updated_at: new Date(),
        },
        'id'
      )
      .where({
        is_active: true,
        id: vehicleId,
      });
  };

  deleteVehicle = async (vehicleId: number) => {
    const trx = await this.knex.transaction();
    try {
      const query = () => {
        return trx
          .update({ is_active: false, updated_at: new Date() }, 'id')
          .where('is_active', true);
      };

      await query().from(tables.VEHICLE_DEVICE).andWhere('vehicle_id', vehicleId);
      await query().from(tables.COMPANY_VEHICLES).andWhere('vehicle_id', vehicleId);
      const id = await query().from(tables.VEHICLES).andWhere('id', vehicleId);

      await trx.commit();
      return id;
    } catch (e) {
      logger.error(e.message);
      await trx.rollback();
      return;
    }
  };
}
