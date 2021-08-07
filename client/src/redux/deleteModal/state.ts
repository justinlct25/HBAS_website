export type DeleteType = "company" | "vehicle" | "";
export interface DeleteModalData {
  isOpen: boolean;
  deleteType: DeleteType;
  vehicleId: number;
  carPlate: string;
  companyId: number;
  companyName: string;
}

export interface DeleteModalState {
  deleteModal: DeleteModalData;
}
