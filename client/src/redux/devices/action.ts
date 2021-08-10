import { CallHistoryMethodAction } from "connected-react-router";
import {
  IAddDeviceCompany,
  IAddDevices,
  IAddDeviceVehicles,
  IDevicesData,
} from "./state";

export function setDevicesDataList(
  devicesDataList: Array<IDevicesData>,
  activePage: number,
  totalPage: number
) {
  return {
    type: "@@ManageDevice/SET_devicesDataList" as const,
    devicesDataList,
    activePage,
    totalPage,
  };
}

export function resetDevicesDataList() {
  return {
    type: "@@ManageDevice/RESET" as const,
  };
}

export function setAddDeviceCompany(adCompanyList: Array<IAddDeviceCompany>) {
  return {
    type: "@@Model/SET_companies" as const,
    adCompanyList,
  };
}
export function setAddDeviceVehicles(
  adVehiclesList: Array<IAddDeviceVehicles>
) {
  return {
    type: "@@Model/SET_vehicles" as const,
    adVehiclesList,
  };
}
export function setAddDevices(adDevicesList: Array<IAddDevices>) {
  return {
    type: "@@Model/SET_devices" as const,
    adDevicesList,
  };
}

type DevicesActionCreators =
  | typeof setDevicesDataList
  | typeof resetDevicesDataList
  | typeof setAddDeviceCompany
  | typeof setAddDeviceVehicles
  | typeof setAddDevices;

export type IDevicesDataActions =
  | ReturnType<DevicesActionCreators>
  | CallHistoryMethodAction;
