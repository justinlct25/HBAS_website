export interface IAlertDataPage {
  address: string;
  battery: string;
  carPlate: string;
  companyContactPerson: string;
  companyId: number;
  companyIsActive: boolean;
  companyName: string;
  companyTel: string;
  date: string;
  deviceEui: string;
  deviceId: number;
  deviceIsActive: boolean;
  deviceName: string;
  deviceVersion: string;
  geolocation: { x: number; y: number };
  id: number;
  msgType: string;
  receivedAt: string;
  vehicleId: number;
  vehicleIsActive: boolean;
}

export interface IAlertDataPageState {
  alertDataList: Array<IAlertDataPage>;
  activePage: number;
  totalPage: number;
  limit: number;
}
