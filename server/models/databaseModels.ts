export interface Companies {
  id: string;
  name: string;
  tel: string;
  contact_person: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicles {
  id: string;
  car_plate: string;
  model: string;
  type: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}

export interface Devices {
  id: string;
  name: string;
  eui: string;
  version: string;
  is_register: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}

export interface AlertData {
  id: string;
  device_id: string;
  date: string;
  geolocation: string;
  address: string;
  msg_type: string;
  battery: string;
  data: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyVehicle {
  id: string;
  company_id: string;
  vehicle_id: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleDevice {
  id: string;
  vehicle_id: string;
  device_id: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}
