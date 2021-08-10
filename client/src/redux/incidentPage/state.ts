export interface IIncidentPageData {
  incidentId?: number;
  vehicleId?: number;
  deviceId?: number;
  date: string;
  longitude: number;
  latitude: number;
  deviceEui?: string;
  deviceName?: string;
  companyName?: string;
  contactPerson?: string;
  phoneNumber?: string;
  carPlate?: string;
  address?: string;
  msgType?: string;
}

export interface IIncidentPageState {
  incidentPage: IIncidentPageData;
}
