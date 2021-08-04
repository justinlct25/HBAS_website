import { Knex } from "knex";
import { insertDevices, insertData } from "./20210804-rawDataset";

type InsertDevices = { id: number; device_eui: string };

export async function seed(knex: Knex): Promise<void> {
    // devices
  const devices = await knex<InsertDevices>('devices')
  .insert(insertDevices)
  .returning(['device_eui', 'id']);

  const devicesMap = devices.reduce((mapping, device) => {
    mapping.set(device.device_eui, device.id);
    return mapping;
  }, new Map<string, number>());

  // alert data
  const alertData = insertData.map((session) => ({
    device_id: devicesMap.get(session.device_eui),
    date: session.date,
    geolocation: session.geolocation,
    address: session.address,
    battery: session.battery,
    data: session.data,
    msg_type: session.msg_type,
  }));

  await knex('alert_data').insert(alertData);
}