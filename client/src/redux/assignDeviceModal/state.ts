export interface AssignDeviceData {
  popUpIsActive: boolean;
  deviceId: number;
  selectedItem: {
    companyId: number;
    companyName: string;
    deviceId: string;
    carPlate: string;
  };
}

export interface AssignDeviceState {
  assignDeviceModal: AssignDeviceData;
}
