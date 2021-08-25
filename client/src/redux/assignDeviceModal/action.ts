export function setPopUpIsActiveAction(isOpen: boolean) {
  return {
    type: "@@assignDeviceModal/setPopUpIsActive" as const,
    isOpen,
  };
}

export function resetPopUpAction() {
  return {
    type: "@@assignDeviceModal/resetModal" as const,
  };
}

export function setSelectedItemAction(selectedItem: {
  companyId?: number | null;
  companyName?: string | null;
  tel?: string | null;
  contactPerson?: string | null;
  deviceId?: number;
  deviceEui?: string;
  carPlate?: string | null;
  vehicleId?: number | null;
  vehicleType?: string | null;
  vehicleModel?: string | null;
  manufactureYear?: string | null;
  manufacturer?: string | null;
}) {
  return {
    type: "@@assignDeviceModal/setSelectedItem" as const,
    selectedItem,
  };
}

type ActionCreators =
  | typeof setPopUpIsActiveAction
  | typeof resetPopUpAction
  | typeof setSelectedItemAction;

export type AssignDeviceAction = ReturnType<ActionCreators>;
