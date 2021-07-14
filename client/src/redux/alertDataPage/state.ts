export interface IAlertDataPage {
  id: number;
  device_name: string;
  device_eui: string;
  date: string;
  time: string;
  geolocation: {x:number, y:number};
  battery: string;
  company_name: string;
  tel: string;
  contact_person: string;
  car_plate: string;
  vehicle_model: string;
  vehicle_type: string;
}

export interface IAlertDataPageState {
  alertDataList: Array<IAlertDataPage>;
  activePage: number;
  totalPage: number;
  limit: number;
}

export const initAlertDataPageState: IAlertDataPageState = {
  alertDataList: [],
  activePage: 1,
  totalPage: 10,
  limit: 5,
};
