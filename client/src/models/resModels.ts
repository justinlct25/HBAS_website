export interface IPagination {
  total: number;
  lastPage: number;
  perPage: number;
  currentPage: number;
  from: number;
  to: number;
}

export interface IDeviceInfo {
  id: number;
  deviceName: string;
  deviceEui: string;
  version?: string;
}

export interface IDevicesForLinking {
  linkedDevices: IDeviceInfo[];
  newDevices: IDeviceInfo[];
}

export interface ICompanyInfo {
  id?: number;
  companyName: string;
  tel: string;
  contactPerson: string;
  updatedAt: string;
  vehiclesCount?: string | number;
}

export interface IVehicleDetail {
  vehicleId: number;
  carPlate: string;
  vehicleModel: string | null;
  vehicleType: string | null;
  manufactureYear: string | null;
  updatedAt: string;
  deviceId: number;
  deviceName: string;
  deviceEui: string;
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

export interface ILocationDetail {
  battery: string;
  deviceId: number;
  deviceName: string;
  deviceEui: string;
  date: string;
  geolocation: { x: number; y: number };
  msgType: string;
  carPlate: string;
  companyName: string;
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
