export function setDeleteModalOpenAction(isOpen: boolean) {
  return {
    type: "@@deleteModal/setDeleteModalOpen" as const,
    isOpen,
  };
}

export function resetDeleteModalAction() {
  return {
    type: "@@deleteModal/resetDeleteModal" as const,
  };
}

export function setDeleteModalDataAction(vehicleDeviceDetails: {
  vehicleId: number;
  carPlate: string;
}) {
  return {
    type: "@@deleteModal/setDeleteModalDataAction" as const,
    vehicleDeviceDetails,
  };
}

type ActionCreators =
  | typeof setDeleteModalOpenAction
  | typeof resetDeleteModalAction
  | typeof setDeleteModalDataAction;

export type DeleteModalAction = ReturnType<ActionCreators>;
