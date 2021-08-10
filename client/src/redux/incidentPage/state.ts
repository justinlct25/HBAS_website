export interface IIncidentPageData {
  incidentId?: number;
  vehicleId?: number | null;
  deviceId?: number;
  date: string;
  longitude: number;
  latitude: number;
  deviceEui?: string;
  deviceName?: string;
  companyName?: string | null;
  contactPerson?: string | null;
  phoneNumber?: string | null;
  carPlate?: string | null;
  address?: string;
  msgType?: string;
}

export interface IIncidentPageState {
  incidentPage: IIncidentPageData;
  isGPSNotFound: boolean;
}
