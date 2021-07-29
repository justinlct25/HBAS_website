import * as Knex from 'knex';
import {
  insertedCompanies,
  insertedVehicles,
  insertedDevices,
  insertedAlertData,
  insertCompanyVehicles,
  insertedVehiclesDevice,
} from '../utils/dataset';
import { tables } from '../utils/table_model';

type InsertCompanies = { id: number; company_name: string };
type InsertVehicles = { id: number; car_plate: string };
type InsertDevices = { id: number; device_eui: string };
type InsertAlertData = {
  device_id: number | undefined;
  date: string;
  geolocation: string;
  address: string;
  battery: string;
  data: string;
  msg_type: string;
};

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tables.VehicleDevice).del();
  await knex(tables.CompanyVehicle).del();
  await knex(tables.AlertData).del();
  await knex(tables.DEVICE).del();
  await knex(tables.VEHICLE).del();
  await knex(tables.COMPANY).del();

  // Inserts seed entries
  const companies: Array<InsertCompanies> = await knex(tables.COMPANY)
    .insert(insertedCompanies)
    .returning(['company_name', 'id']);
  const companiesMap = companies.reduce((mapping, company) => {
    mapping.set(company.company_name, company.id);
    return mapping;
  }, new Map<string, number>());

  const vehicles: Array<InsertVehicles> = await knex(tables.VEHICLE)
    .insert(insertedVehicles)
    .returning(['car_plate', 'id']);
  const vehiclesMap = vehicles.reduce((mapping, vehicle) => {
    mapping.set(vehicle.car_plate, vehicle.id);
    return mapping;
  }, new Map<string, number>());

  const devices: Array<InsertDevices> = await knex(tables.DEVICE)
    .insert(insertedDevices)
    .returning(['device_eui', 'id']);
  const devicesMap = devices.reduce((mapping, device) => {
    mapping.set(device.device_eui, device.id);
    return mapping;
  }, new Map<string, number>());

  const alertData: Array<InsertAlertData> = insertedAlertData.map((session) => ({
    device_id: devicesMap.get(session.device_eui),
    date: session.date,
    geolocation: session.geolocation,
    address: session.address,
    battery: session.battery,
    data: session.data,
    msg_type: session.msg_type,
  }));
  await knex(tables.AlertData).insert(alertData);

  const companyVehicles = insertCompanyVehicles.map((session) => ({
    company_id: companiesMap.get(session.company_name),
    vehicle_id: vehiclesMap.get(session.car_plate),
  }));
  await knex(tables.CompanyVehicle).insert(companyVehicles);

  const vehicleDevice = insertedVehiclesDevice.map((session) => ({
    device_id: devicesMap.get(session.device_eui),
    vehicle_id: vehiclesMap.get(session.car_plate),
  }));
  await knex(tables.VehicleDevice).insert(vehicleDevice);
}
