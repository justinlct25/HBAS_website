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
    time: string;
    geolocation: string;
    battery: string;
    data: string;
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
    await knex("companies").insert([
        { company_name: "Muselabs", tel: "67182301", contact_person: "Chan Tai Man" },
        { company_name: "Highway Bound", tel: "60740748", contact_person: "Lee Hui Sai" },
        { company_name: "transite", tel: "58787520", contact_person: "Wong wai web" },
        { company_name: "Bridgine", tel: "66109325", contact_person: "Li Cow Lon" }
    ]);
    await knex("vehicles").insert([
        {car_plate:"AX789", vehicle_model:"SCANIA", vehicle_type:"18"},
        {car_plate:"JG1330", vehicle_model:"SCANIA", vehicle_type:"20"},
        {car_plate:"BM7414", vehicle_model:"Volvo", vehicle_type:"22"},
        {car_plate:"GV1032", vehicle_model:"Isuzu", vehicle_type:"24"},
        {car_plate:"TM7532", vehicle_model:"Volvo", vehicle_type:"20"},
        {car_plate:"LP3209", vehicle_model:"Isuzu", vehicle_type:"20"}
    ]);
    await knex("devices").insert([
        {device_name: "ramp_meter_000", device_eui: "RzrIaAAqADc="},
        {device_name: "ramp_meter_001", device_eui: "jPlXIAADvQ0="},
        {device_name: "ramp_meter_002", device_eui: "RzrIaAAqADd="},
        {device_name: "ramp_meter_003", device_eui: "RzrIaAAqADe="},
        {device_name: "ramp_meter_004", device_eui: "RzrIaAAqADf="},
        {device_name: "ramp_meter_005", device_eui: "RzrIaAAqADg="}
    ]);
    await knex("alert_data").insert([
        { device_id: 1, date: new Date("2020-06-03").toLocaleDateString('en-CA'), time: "05:19:53", geolocation: "22.123456,114.12346", battery: "1.95", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 1, date: new Date("2020-06-04").toLocaleDateString('en-CA'), time: "10:25:23", geolocation: "22.432875,114.69823", battery: "1.94", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 1, date: new Date("2020-06-14").toLocaleDateString('en-CA'), time: "16:12:30", geolocation: "22.638301,114.37821", battery: "1.93", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 2, date: new Date("2020-06-15").toLocaleDateString('en-CA'), time: "18:12:30", geolocation: "22.638301,114.37821", battery: "1.93", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 2, date: new Date("2020-06-18").toLocaleDateString('en-CA'), time: "19:12:30", geolocation: "22.789324,114.19024", battery: "1.71", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 2, date: new Date("2020-06-23").toLocaleDateString('en-CA'), time: "20:12:30", geolocation: "22.784757,114.74598", battery: "1.83", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 2, date: new Date("2020-06-23").toLocaleDateString('en-CA'), time: "18:12:35", geolocation: "22.784757,114.74598", battery: "1.82", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 2, date: new Date("2020-06-23").toLocaleDateString('en-CA'), time: "20:12:40", geolocation: "22.784757,114.74598", battery: "1.84", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 2, date: new Date("2020-06-27").toLocaleDateString('en-CA'), time: "21:12:30", geolocation: "22.902848,114.84925", battery: "1.91", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 3, date: new Date("2020-06-24").toLocaleDateString('en-CA'), time: "18:12:30", geolocation: "22.819273,114.87994", battery: "1.89", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 4, date: new Date("2020-06-28").toLocaleDateString('en-CA'), time: "13:52:30", geolocation: "22.839247,114.67521", battery: "1.62", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 5, date: new Date("2020-06-29").toLocaleDateString('en-CA'), time: "14:22:30", geolocation: "22.901823,114.89127", battery: "1.52", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 5, date: new Date("2020-06-20").toLocaleDateString('en-CA'), time: "15:13:30", geolocation: "22.093749,114.09123", battery: "1.73", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"},
        { device_id: 4, date: new Date("2020-07-04").toLocaleDateString('en-CA'), time: "20:15:30", geolocation: "22.817236,114.22712", battery: "1.65", data: "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw"}
    ]);
    await knex("company_vehicles").insert([
        {company_id: 1, vehicle_id: 1 },
        {company_id: 2, vehicle_id: 2 },
        {company_id: 3, vehicle_id: 3 },
        {company_id: 4, vehicle_id: 4 },
        {company_id: 1, vehicle_id: 5 },
        {company_id: 2, vehicle_id: 6 }
    ]);
    await knex("vehicle_device").insert([
        {device_id: 1, vehicle_id: 1},
        {device_id: 2, vehicle_id: 2},
        {device_id: 3, vehicle_id: 3},
        {device_id: 4, vehicle_id: 4},
        {device_id: 5, vehicle_id: 5},
        {device_id: 6, vehicle_id: 6}
    ]);
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
        time: session.time,
        geolocation: session.geolocation,
        battery: session.battery,
        data: session.data,
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
