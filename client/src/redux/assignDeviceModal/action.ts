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
  companyId?: number;
  companyName?: string;
  tel?: string;
  contactPerson?: string;
  deviceId?: number;
  deviceEui?: string;
  carPlate?: string;
  vehicleId?: number;
  vehicleType?: string;
  vehicleModel?: string;
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
