import { AssignDeviceAction } from "./action";
import { AssignDeviceState } from "./state";

export const initialState: AssignDeviceState = {
  assignDeviceModal: {
    popUpIsActive: false,
    deviceId: -1,
    selectedItem: {
      companyId: -1,
      companyName: "",
      deviceId: "",
      carPlate: "",
    },
  },
};

export const assignDeviceReducer = (
  state: AssignDeviceState = initialState,
  action: AssignDeviceAction
): AssignDeviceState => {
  switch (action.type) {
    case "@@assignDeviceModal/setPopUpIsActive":
      return {
        ...state,
        assignDeviceModal: {
          ...state.assignDeviceModal,
          popUpIsActive: action.isOpen,
        },
      };
    case "@@assignDeviceModal/resetModal":
      return {
        ...initialState,
      };
    case "@@assignDeviceModal/setSelectedItem":
      return {
        ...state,
        assignDeviceModal: {
          ...state.assignDeviceModal,
          selectedItem: {
            companyId:
              action.selectedItem.companyId ??
              state.assignDeviceModal.selectedItem.companyId,
            companyName:
              action.selectedItem.companyName ??
              state.assignDeviceModal.selectedItem.companyName,
            deviceId:
              action.selectedItem.deviceId ??
              state.assignDeviceModal.selectedItem.deviceId,
            carPlate:
              action.selectedItem.carPlate ??
              state.assignDeviceModal.selectedItem.carPlate,
          },
        },
      };
    case "@@assignDeviceModal/setDeviceId":
      return {
        ...state,
        assignDeviceModal: {
          ...state.assignDeviceModal,
          deviceId: action.id,
          selectedItem: {
            ...state.assignDeviceModal.selectedItem,
            deviceId: action.eui,
          },
        },
      };
    default:
      return state;
  }
};
