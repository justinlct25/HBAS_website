export type direction = 'asc' | 'desc';
export type msgType = 'A' | 'B' | 'S';
export type Roles = 'ADMIN' | 'USER';

export interface IUserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  devicesCount?: string | number;
}

export interface INewUser {
  username: string;
  email?: string;
  role?: string;
}

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
  manufacturer: string | null;
  vehicleModel: string | null;
  vehicleType: string | null;
  manufactureYear: string | null;
}

export interface IVehicleDetail {
  vehicleId: number;
  carPlate: string;
  manufacturer: string | null;
  vehicleModel: string | null;
  vehicleType: string | null;
  manufactureYear: string | null;
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
  rssi: number | null;
  snr: number | null;
  carPlate: string;
  companyName: string;
}

export interface IDataHistory {
  id: number;
  deviceId: number;
  geolocation: {
    x: number;
    y: number;
  };
  date: string;
  address: string;
  msgType: string;
  battery: string;
}

export interface IDeviceDetail {
  deviceId: number;
  deviceName: string;
  deviceEui: string;
  deviceIsActive: boolean;
  vehicleId: number | null;
  carPlate: string | null;
  vehicleIsActive: boolean;
  companyId: number | null;
  companyName: string | null;
  tel: string | null;
  contactPerson: string | null;
  companyIsActive: boolean;
  updatedAt: string;
}

export interface IDeviceInfo {
  id: number;
  deviceName: string;
  deviceEui: string;
  version?: string;
}

export interface IAlertData {
  id: number;
  date: string;
  geolocation: {
    x: number;
    y: number;
  };
  address: string;
  msgType: string;
  battery: string;
  rssi: number | null;
  snr: number | null;
  receivedAt: string;
  deviceId: number;
  deviceName: string;
  deviceEui: string;
  deviceVersion: string;
  deviceIsActive: boolean;
  vehicleId: number | null;
  carPlate: string | null;
  vehicleIsActive: boolean | null;
  companyId: number | null;
  companyName: string | null;
  companyTel: string | null;
  companyContactPerson: string | null;
  companyIsActive: boolean | null;
}
