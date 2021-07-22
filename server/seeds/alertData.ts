import * as Knex from "knex";
import {
    insertedCompanies, 
    insertedVehicles, 
    insertedDevices, 
    insertedAlertData, 
    insertCompanyVehicles, 
    insertedVehiclesDevice
} from '../utils/dataset';

type InsertCompanies = { id:number; company_name: string;};
type InsertVehicles = { id:number; car_plate:string;}
type InsertDevices = { id:number; device_eui:string;}
type InsertAlertData = { 
    device_id: number | undefined;
    date: string;
    geolocation: string;
    address: string;
    battery: string;
    data: string;
    msg_type: string;
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("vehicle_device").del();
    await knex("company_vehicles").del();
    await knex("alert_data").del();
    await knex("devices").del();
    await knex("vehicles").del();
    await knex("companies").del();

    // Inserts seed entries
    const companies:Array<InsertCompanies> = await knex("companies").insert(insertedCompanies).returning(['company_name', 'id']);
    const companiesMap = companies.reduce((mapping, company) => {
        mapping.set(company.company_name, company.id);
        return mapping;
    }, new Map<string, number>());

    const vehicles:Array<InsertVehicles> = await knex("vehicles").insert(insertedVehicles).returning(['car_plate', 'id']);
    const vehiclesMap = vehicles.reduce((mapping, vehicle) => {
        mapping.set(vehicle.car_plate, vehicle.id);
        return mapping;
    }, new Map<string, number>());

    const devices:Array<InsertDevices> = await knex("devices").insert(insertedDevices).returning(['device_eui', 'id']);
    const devicesMap = devices.reduce((mapping, device) => {
        mapping.set(device.device_eui, device.id);
        return mapping;
    }, new Map<string, number>());

    const alertData:Array<InsertAlertData> = insertedAlertData.map((session)=>({
        device_id: devicesMap.get(session.device_eui),
        date: session.date,
        geolocation: session.geolocation,
        address: session.address,
        battery: session.battery,
        data: session.data,
        msg_type: session.msg_type,
    }));
    await knex("alert_data").insert(alertData);

    const companyVehicles = insertCompanyVehicles.map((session)=>({
        company_id: companiesMap.get(session.company_name),
        vehicle_id: vehiclesMap.get(session.car_plate)
    }));
    await knex("company_vehicles").insert(companyVehicles);

    const vehicleDevice = insertedVehiclesDevice.map((session)=>({
        device_id: devicesMap.get(session.device_eui), 
        vehicle_id: vehiclesMap.get(session.car_plate)
    }))
    await knex("vehicle_device").insert(vehicleDevice);
};
