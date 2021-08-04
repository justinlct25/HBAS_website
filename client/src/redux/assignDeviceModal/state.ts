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
    vehicleId: number;
  };
}

export interface AssignDeviceState {
  assignDeviceModal: AssignDeviceData;
}
