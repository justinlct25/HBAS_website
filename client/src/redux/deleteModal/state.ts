export interface DeleteModalData {
  isOpen: boolean;
  vehicleId: number;
  carPlate: string;
}

export interface DeleteModalState {
  deleteModal: DeleteModalData;
}
