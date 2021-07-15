export interface IIncidentPageData {
  date: string;
  time: string;
  longitude: number;
  latitude: number;
  deviceId: string;
  deviceName: string;
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  carPlate: string;
}

export interface IIncidentPageState {
  incidentPage: IIncidentPageData;
}
