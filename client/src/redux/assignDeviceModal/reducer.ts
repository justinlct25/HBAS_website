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
      vehicleModel: "",
      vehicleType: "",
      vehicleId: -1,
      manufactureYear: null,
      manufacturer: null,
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
          deviceId: action.selectedItem.deviceId ?? state.assignDeviceModal.deviceId,
          selectedItem: {
            ...state.assignDeviceModal.selectedItem,
            companyId:
              action.selectedItem.companyId ?? state.assignDeviceModal.selectedItem.companyId,
            companyName:
              action.selectedItem.companyName ?? state.assignDeviceModal.selectedItem.companyName,
            tel: action.selectedItem.tel ?? state.assignDeviceModal.selectedItem.tel,
            contactPerson:
              action.selectedItem.contactPerson ??
              state.assignDeviceModal.selectedItem.contactPerson,
            deviceEui:
              action.selectedItem.deviceEui ?? state.assignDeviceModal.selectedItem.deviceEui,
            carPlate: action.selectedItem.carPlate ?? state.assignDeviceModal.selectedItem.carPlate,
            vehicleId:
              action.selectedItem.vehicleId ?? state.assignDeviceModal.selectedItem.vehicleId,
            vehicleType:
              action.selectedItem.vehicleType ?? state.assignDeviceModal.selectedItem.vehicleType,
            vehicleModel:
              action.selectedItem.vehicleModel ?? state.assignDeviceModal.selectedItem.vehicleModel,
            manufactureYear:
              action.selectedItem.manufactureYear ??
              state.assignDeviceModal.selectedItem.manufactureYear,
            manufacturer:
              action.selectedItem.manufacturer ?? state.assignDeviceModal.selectedItem.manufacturer,
          },
        },
      };
    default:
      return state;
  }
};
