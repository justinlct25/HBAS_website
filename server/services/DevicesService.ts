import { tables } from './../utils/table_model';
import { Knex } from 'knex';

export class DevicesService {
  constructor(private knex: Knex) {}

  getDevicesForLinking = async (deviceId: number | null) => {
    const query = () => {
      return this.knex(tables.DEVICES)
        .distinct<
          {
            id: number;
            device_name: string;
            device_eui: string;
          }[]
        >(['id', 'device_name', 'device_eui'])
        .where('is_active', true)
        .andWhereNot('id', deviceId)
        .orderBy('device_eui');
    };

    const filterQuery = (builder: Knex.QueryBuilder) => {
      builder
        .select('device_id')
        .from(tables.VEHICLE_DEVICE)
        .whereRaw(`${tables.DEVICES}.id = ${tables.VEHICLE_DEVICE}.device_id`)
        .andWhere('is_active', true);
    };

    return {
      linkedDevices: await query().whereExists(filterQuery),
      newDevices: await query().whereNotExists(filterQuery),
    };
  };

  unlinkExistingPairs = async (deviceId: number, vehicleId: number) => {
    return await this.knex(tables.VEHICLE_DEVICE)
      .update({
        is_active: false,
        updated_at: new Date(Date.now()),
      })
      .where((builder) => {
        builder.where('device_id', deviceId).orWhere('vehicle_id', vehicleId);
      })
      .andWhere('is_active', true);
  };

  linkDeviceAndVehicle = async (deviceId: number, vehicleId: number) => {
    return await this.knex(tables.VEHICLE_DEVICE)
      .insert({
        device_id: deviceId,
        vehicle_id: vehicleId,
      })
      .returning<number[]>('id');
  };
}
