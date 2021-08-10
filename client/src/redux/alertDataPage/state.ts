export interface IAlertDataPage {
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

export interface IAlertDataPageState {
  alertDataList: Array<IAlertDataPage>;
  activePage: number;
  totalPage: number;
}
