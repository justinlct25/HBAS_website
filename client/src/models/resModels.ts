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
