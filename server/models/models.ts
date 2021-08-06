export type direction = 'asc' | 'desc';
export type msgType = 'A' | 'B';

export interface ICompanyInfo {
  id?: number;
  companyName: string;
  tel: string;
  contactPerson: string;
  updatedAt: string;
  vehiclesCount?: string | number;
}

export interface INewCompany {
  companyName: string;
  tel: string;
  contactPerson: string | null;
}

export interface INewVehicle {
  carPlate: string;
  vehicleModel: string | null;
  vehicleType: string | null;
}

export interface IVehicleDetail {
  vehicleId: number;
  carPlate: string;
  vehicleModel: string | null;
  vehicleType: string | null;
  updatedAt: string;
  deviceId: number;
  deviceName: string;
  deviceEui: string;
}

export interface ILocationDetail {
  deviceId: number;
  deviceName: string;
  deviceEui: string;
  date: string;
  geolocation: string;
  msgType: string;
  battery: string;
  carPlate: string;
  companyName: string;
}

export interface IDataHistory {
  id: number;
  deviceId: number;
  geolocation: string;
  date: string;
  address: string;
  msgType: string;
  battery: string;
}

export interface IDeviceDetail {
  deviceId: number;
  deviceName: string;
  deviceEui: string;
  vehicleId: number | null;
  carPlate: string | null;
  companyId: number | null;
  companyName: string | null;
  tel: string | null;
  contactPerson: string | null;
  updatedAt: string;
}

export interface IDeviceInfo {
  id: number;
  deviceName: string;
  deviceEui: string;
  version?: string;
}
