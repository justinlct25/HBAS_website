import { DeleteType } from "./state";

export function setDeleteModalOpenAction(
  isOpen: boolean,
  deleteType: DeleteType
) {
  return {
    type: "@@deleteModal/setDeleteModalOpen" as const,
    isOpen,
    deleteType,
  };
}

export function resetDeleteModalAction() {
  return {
    type: "@@deleteModal/resetDeleteModal" as const,
  };
}

export function setDeleteModalDataAction(details: {
  vehicleId?: number;
  carPlate?: string;
  companyId?: number;
  companyName?: string;
}) {
  return {
    type: "@@deleteModal/setDeleteModalDataAction" as const,
    details,
  };
}

type ActionCreators =
  | typeof setDeleteModalOpenAction
  | typeof resetDeleteModalAction
  | typeof setDeleteModalDataAction;

export type DeleteModalAction = ReturnType<ActionCreators>;
