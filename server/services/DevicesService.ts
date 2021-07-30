import { tables } from './../utils/table_model';
import { Knex } from 'knex';

export class DevicesService {
  constructor(private knex: Knex) {}

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
