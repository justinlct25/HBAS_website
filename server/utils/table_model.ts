import {
  AlertData,
  Companies,
  CompanyVehicle,
  Devices,
  VehicleDevice,
  Vehicles,
} from '../models/databaseModels';

export const tables = Object.freeze({
  COMPANIES: 'companies',
  VEHICLES: 'vehicles',
  DEVICES: 'devices',
  ALERT_DATA: 'alert_data',
  COMPANY_VEHICLES: 'company_vehicles',
  VEHICLE_DEVICE: 'vehicle_device',
});

export const companies: Companies = Object.freeze({
  id: `${tables.COMPANIES}.id`,
  name: `${tables.COMPANIES}.company_name`,
  tel: `${tables.COMPANIES}.tel`,
  contact_person: `${tables.COMPANIES}.contact_person`,
  is_active: `${tables.COMPANIES}.is_active`,
  created_at: `${tables.COMPANIES}.created_at`,
  updated_at: `${tables.COMPANIES}.updated_at`,
});

export const vehicles: Vehicles = Object.freeze({
  id: `${tables.VEHICLES}.id`,
  car_plate: `${tables.VEHICLES}.car_plate`,
  model: `${tables.VEHICLES}.vehicle_model`,
  type: `${tables.VEHICLES}.vehicle_type`,
  is_active: `${tables.VEHICLES}.is_active`,
  created_at: `${tables.VEHICLES}.created_at`,
  updated_at: `${tables.VEHICLES}.updated_at`,
});

export const devices: Devices = Object.freeze({
  id: `${tables.DEVICES}.id`,
  name: `${tables.DEVICES}.device_name`,
  eui: `${tables.DEVICES}.device_eui`,
  version: `${tables.DEVICES}.version`,
  is_register: `${tables.DEVICES}.is_register`,
  is_active: `${tables.DEVICES}.is_active`,
  created_at: `${tables.DEVICES}.created_at`,
  updated_at: `${tables.DEVICES}.updated_at`,
});

export const alertData: AlertData = Object.freeze({
  id: `${tables.ALERT_DATA}.id`,
  device_id: `${tables.ALERT_DATA}.device_id`,
  date: `${tables.ALERT_DATA}.date`,
  geolocation: `${tables.ALERT_DATA}.geolocation`,
  address: `${tables.ALERT_DATA}.address`,
  msg_type: `${tables.ALERT_DATA}.msg_type`,
  battery: `${tables.ALERT_DATA}.battery`,
  data: `${tables.ALERT_DATA}.data`,
  is_active: `${tables.ALERT_DATA}.is_active`,
  created_at: `${tables.ALERT_DATA}.created_at`,
  updated_at: `${tables.ALERT_DATA}.updated_at`,
});

export const companyVehicle: CompanyVehicle = Object.freeze({
  id: `${tables.COMPANY_VEHICLES}.id`,
  company_id: `${tables.COMPANY_VEHICLES}.company_id`,
  vehicle_id: `${tables.COMPANY_VEHICLES}.vehicle_id`,
  is_active: `${tables.COMPANY_VEHICLES}.is_active`,
  created_at: `${tables.COMPANY_VEHICLES}.created_at`,
  updated_at: `${tables.COMPANY_VEHICLES}.updated_at`,
});

export const vehicleDevice: VehicleDevice = Object.freeze({
  id: `${tables.VEHICLE_DEVICE}.id`,
  vehicle_id: `${tables.VEHICLE_DEVICE}.vehicle_id`,
  device_id: `${tables.VEHICLE_DEVICE}.device_id`,
  is_active: `${tables.VEHICLE_DEVICE}.is_active`,
  created_at: `${tables.VEHICLE_DEVICE}.created_at`,
  updated_at: `${tables.VEHICLE_DEVICE}.updated_at`,
});
