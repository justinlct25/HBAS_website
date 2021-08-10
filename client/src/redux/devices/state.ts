//// device show by default page
export interface IDevicesData {
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

export interface IDevicesDataState {
  devicesDataList: Array<IDevicesData>;
  activePage: number;
  totalPage: number;
}

export const initDevicesDataState: IDevicesDataState = {
  devicesDataList: [],
  activePage: 1,
  totalPage: 1,
};
////End of device show by default page

//// Add devices redux
//-----interface
export interface IAddDeviceCompany {
  id: number;
  company_name: string;
}
export interface IAddDeviceVehicles {
  id: number;
  car_plate: string;
}
export interface IAddDevices {
  id: number;
  device_eui: string;
}
