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
  deviceId?: number;
  deviceEui?: string;
  carPlate?: string;
  vehicleId?: number;
}) {
  return {
    type: "@@assignDeviceModal/setSelectedItem" as const,
    selectedItem,
  };
}

export function setDeviceIdAction(id: number, eui: string) {
  return {
    type: "@@assignDeviceModal/setDeviceId" as const,
    id,
    eui,
  };
}

type ActionCreators =
  | typeof setPopUpIsActiveAction
  | typeof resetPopUpAction
  | typeof setSelectedItemAction
  | typeof setDeviceIdAction;

export type AssignDeviceAction = ReturnType<ActionCreators>;
