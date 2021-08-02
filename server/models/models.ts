export type direction = 'asc' | 'desc';

export interface IVehiclesDetail {
  vehicleId: number;
  carPlate: string;
  vehicleModel: string;
  vehicleType: string;
  updatedAt: string;
  deviceId: number;
  deviceName: string;
  deviceEui: string;
}

export interface ICompanyInfo {
  id: number;
  companyName: string;
  tel: string;
  contactPerson: string;
  updatedAt: string;
  vehiclesCount: string | number;
}
