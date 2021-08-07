export type ModalType =
  | "addNew"
  | "addNewVehicle"
  | "editCompany"
  | "editVehicle"
  // | "carPlate"
  // | "device"
  | "";
export interface AddNewFormData {
  isOpen: boolean;
  modalType: ModalType;
  companyName: string;
  contactPerson: string;
  tel: string;
  vehicles: VehicleType[];
}

export type VehicleType = {
  carPlate?: string;
  vehicleType?: string;
  vehicleModel?: string;
};

export interface AddNewFormState {
  addNewForm: AddNewFormData;
}
