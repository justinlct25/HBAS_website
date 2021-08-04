import { Knex } from "knex";
import { insertDevices, insertData, insertCars, insertVehicleDevice } from "../utils/20210804-rawDataset";

type InsertVehicles = { id: number; car_plate: string };
type InsertDevices = { id: number; device_eui: string };

export async function seed(knex: Knex): Promise<void> {

  // vehicles
  const vehicles = await knex<InsertVehicles>('vehicles')
    .insert(insertCars)
    .returning(['car_plate', 'id']);

  const vehiclesMap = vehicles.reduce((mapping, vehicle) => {
    mapping.set(vehicle.car_plate, vehicle.id);
    return mapping;
  }, new Map<string, number>());

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

  // const vehicle-device
  const vehicleDevice = insertVehicleDevice.map((session) => ({
    device_id: devicesMap.get(session.device_eui),
    vehicle_id: vehiclesMap.get(session.car_plate),
  }));

  await knex('vehicle_device').insert(vehicleDevice);
  
}