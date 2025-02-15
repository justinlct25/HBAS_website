import { Knex } from 'knex';
import {
  insertCompanyVehicles,
  insertedAlertData,
  insertedCompanies,
  insertedDevices,
  insertedVehicles,
  insertedVehiclesDevice,
} from '../utils/dataset';
import { tables } from '../utils/table_model';

type InsertCompanies = { id: number; company_name: string };
type InsertVehicles = { id: number; car_plate: string };
type InsertDevices = { id: number; device_eui: string };

export async function seed(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === 'production') return;
  
  // Deletes ALL existing entries
  await knex(tables.VEHICLE_DEVICE).del();
  await knex(tables.COMPANY_VEHICLES).del();
  await knex(tables.ALERT_DATA).del();
  await knex(tables.DEVICES).del();
  await knex(tables.VEHICLES).del();
  await knex(tables.COMPANIES).del();

  // Inserts seed entries
  // companies
  const companies = await knex<InsertCompanies>(tables.COMPANIES)
    .insert(insertedCompanies)
    .returning(['company_name', 'id']);

  const companiesMap = companies.reduce((mapping, company) => {
    mapping.set(company.company_name, company.id);
    return mapping;
  }, new Map<string, number>());

  // vehicles
  const vehicles = await knex<InsertVehicles>(tables.VEHICLES)
    .insert(insertedVehicles)
    .returning(['car_plate', 'id']);

  const vehiclesMap = vehicles.reduce((mapping, vehicle) => {
    mapping.set(vehicle.car_plate, vehicle.id);
    return mapping;
  }, new Map<string, number>());

  // devices
  const devices = await knex<InsertDevices>(tables.DEVICES)
    .insert(insertedDevices)
    .returning(['device_eui', 'id']);

  const devicesMap = devices.reduce((mapping, device) => {
    mapping.set(device.device_eui, device.id);
    return mapping;
  }, new Map<string, number>());

  // alert data
  const alertData = insertedAlertData.map((session) => ({
    device_id: devicesMap.get(session.device_eui),
    date: session.date,
    geolocation: session.geolocation,
    address: session.address,
    battery: session.battery,
    data: session.data,
    msg_type: session.msg_type,
  }));

  await knex(tables.ALERT_DATA).insert(alertData);

  // company-vehicles
  const companyVehicles = insertCompanyVehicles.map((session) => ({
    company_id: companiesMap.get(session.company_name),
    vehicle_id: vehiclesMap.get(session.car_plate),
  }));

  await knex(tables.COMPANY_VEHICLES).insert(companyVehicles);

  // const vehicle-device
  const vehicleDevice = insertedVehiclesDevice.map((session) => ({
    device_id: devicesMap.get(session.device_eui),
    vehicle_id: vehiclesMap.get(session.car_plate),
  }));

  await knex(tables.VEHICLE_DEVICE).insert(vehicleDevice);
}
