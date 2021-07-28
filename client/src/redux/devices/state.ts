//// device show by default page
export interface IDevicesData {
  id: number;
  device_name: string;
  device_eui: string;
  car_plate: string;
  vehicle_id: number;
  vehicle_model: string;
  vehicle_type: string;
  company_id: number;
  company_name: string;
  tel: string;
  contact_person: string;
}

export interface IDevicesDataState {
  devicesDataList: Array<IDevicesData>;
  activePage: number;
  totalPage: number;
  limit: number;
}

export const initDevicesDataState: IDevicesDataState = {
  devicesDataList: [],
  activePage: 1,
  totalPage: 10,
  limit: 7,
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

//-----state interface
export interface IAddDeviceCompanyState {
  adCompanyList: Array<IAddDeviceCompany>;
}
export interface IAddDeviceVehiclesState {
  adVehiclesList: Array<IAddDeviceVehicles>;
}
export interface IAddDevicesState {
  adDevicesList: Array<IAddDevices>;
}
//-----initial state for add devices
export const initAddDeviceCompanyState: IAddDeviceCompanyState = {
  adCompanyList: [],
};
export const initAddDeviceVehiclesState: IAddDeviceVehiclesState = {
  adVehiclesList: [],
};
export const initAddDevicesState: IAddDevicesState = {
  adDevicesList: [],
};
//// End of add devices redux
