export interface AddNewFormData {
  isOpen: boolean;
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
