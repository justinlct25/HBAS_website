import { AssignDeviceAction } from "./action";
import { AssignDeviceState } from "./state";

export const initialState: AssignDeviceState = {
  assignDeviceModal: {
    popUpIsActive: false,
    deviceId: -1,

    selectedItem: {
      companyId: -1,
      companyName: "",
      tel: "",
      contactPerson: "",
      deviceEui: "",
      carPlate: "",
      vehicleId: -1,
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
          deviceId:
            action.selectedItem.deviceId ?? state.assignDeviceModal.deviceId,
          selectedItem: {
            companyId:
              action.selectedItem.companyId ??
              state.assignDeviceModal.selectedItem.companyId,
            companyName:
              action.selectedItem.companyName ??
              state.assignDeviceModal.selectedItem.companyName,
            tel:
              action.selectedItem.tel ??
              state.assignDeviceModal.selectedItem.tel,
            contactPerson:
              action.selectedItem.contactPerson ??
              state.assignDeviceModal.selectedItem.contactPerson,
            deviceEui:
              action.selectedItem.deviceEui ??
              state.assignDeviceModal.selectedItem.deviceEui,
            carPlate:
              action.selectedItem.carPlate ??
              state.assignDeviceModal.selectedItem.carPlate,
            vehicleId:
              action.selectedItem.vehicleId ??
              state.assignDeviceModal.selectedItem.vehicleId,
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
            deviceEui: action.eui,
          },
        },
      };
    default:
      return state;
  }
};
