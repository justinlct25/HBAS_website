export const tables = Object.freeze({
    COMPANY:'companies',
    VEHICLE:'vehicles',
    DEVICE:'devices',
    AlertData:'alert_data',
    CompanyVehicle:'company_vehicles',
    VehicleDevice:'vehicle_device',
});

export const companies:Companies = Object.freeze({
    id:`${tables.COMPANY}.id`,
    name:`${tables.COMPANY}.company_name`,
    tel:`${tables.COMPANY}.tel`,
    contact_person:`${tables.COMPANY}.contact_person`,
    is_active:`${tables.COMPANY}.is_active`,
    created_at:`${tables.COMPANY}.created_at`,
    updated_at:`${tables.COMPANY}.updated_at`,
});

export const vehicles:Vehicles = Object.freeze({
    id:`${tables.VEHICLE}.id`,
    car_plate:`${tables.VEHICLE}.car_plate`,
    model:`${tables.VEHICLE}.vehicle_model`,
    type:`${tables.VEHICLE}.vehicle_type`,
    is_active:`${tables.VEHICLE}.is_active`,
    created_at:`${tables.VEHICLE}.created_at`,
    updated_at:`${tables.VEHICLE}.updated_at`,
});

export const devices:Devices = Object.freeze({
    id:`${tables.DEVICE}.id`,
    name:`${tables.DEVICE}.device_name`,
    eui:`${tables.DEVICE}.device_eui`,
    version:`${tables.DEVICE}.version`,
    is_register:`${tables.DEVICE}.is_register`,
    is_active:`${tables.DEVICE}.is_active`,
    created_at:`${tables.DEVICE}.created_at`,
    updated_at:`${tables.DEVICE}.updated_at`,
});

export const alertData:AlertData = Object.freeze({
    id:`${tables.AlertData}.id`,
    device_id:`${tables.AlertData}.device_id`,
    date:`${tables.AlertData}.date`,
    geolocation:`${tables.AlertData}.geolocation`,
    address:`${tables.AlertData}.address`,
    msg_type:`${tables.AlertData}.msg_type`,
    battery:`${tables.AlertData}.battery`,
    data:`${tables.AlertData}.data`,
    is_active:`${tables.AlertData}.is_active`,
    created_at:`${tables.AlertData}.created_at`,
    updated_at:`${tables.AlertData}.updated_at`,
});

export const companyVehicle:CompanyVehicle = Object.freeze({
    id:`${tables.CompanyVehicle}.id`,
    company_id:`${tables.CompanyVehicle}.company_id`,
    vehicle_id:`${tables.CompanyVehicle}.vehicle_id`,
    is_active:`${tables.CompanyVehicle}.is_active`,
    created_at:`${tables.CompanyVehicle}.created_at`,
    updated_at:`${tables.CompanyVehicle}.updated_at`,
});

export const vehicleDevice:VehicleDevice = Object.freeze({
    id:`${tables.VehicleDevice}.id`,
    vehicle_id:`${tables.VehicleDevice}.vehicle_id`,
    device_id:`${tables.VehicleDevice}.device_id`,
    is_active:`${tables.VehicleDevice}.is_active`,
    created_at:`${tables.VehicleDevice}.created_at`,
    updated_at:`${tables.VehicleDevice}.updated_at`,
});

export interface Companies{
    id:string;
    name:string;
    tel:string;
    contact_person:string;
    is_active:string;
    created_at:string;
    updated_at:string;
}

export interface Vehicles{
    id:string;
    car_plate:string;
    model:string;
    type:string;
    is_active:string;
    created_at:string;
    updated_at:string;
}

export interface Devices{
    id:string;
    name:string;
    eui:string;
    version:string;
    is_register:string;
    is_active:string;
    created_at:string;
    updated_at:string;
}

export interface AlertData{
    id:string;
    device_id:string;
    date:string;
    geolocation:string;
    address:string;
    msg_type:string;
    battery:string;
    data:string;
    is_active:string;
    created_at:string;
    updated_at:string;
}

export interface CompanyVehicle{
    id:string;
    company_id:string;
    vehicle_id:string;
    is_active:string;
    created_at:string;
    updated_at:string;
}

export interface VehicleDevice{
    id:string;
    vehicle_id:string;
    device_id:string;
    is_active:string;
    created_at:string;
    updated_at:string;
}