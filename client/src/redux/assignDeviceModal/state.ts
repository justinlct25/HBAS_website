export interface AssignDeviceData {
  popUpIsActive: boolean;
  deviceId: number;
  selectedItem: {
    companyId: number;
    companyName: string;
    tel: string;
    contactPerson: string;
    deviceEui: string;
    carPlate: string;
    vehicleType: string | null;
    vehicleModel: string | null;
    vehicleId: number;
    manufactureYear: string | null;
    manufacturer: string | null;
  };
}

export interface AssignDeviceState {
  assignDeviceModal: AssignDeviceData;
}
