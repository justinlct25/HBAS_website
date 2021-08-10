import { IIncidentPageAction } from "./action";
import { IIncidentPageState } from "./state";

export const initialState: IIncidentPageState = {
  incidentPage: {
    address: "",
    incidentId: -1,
    vehicleId: -1,
    deviceEui: "",
    date: "",
    longitude: -1,
    latitude: -1,
    deviceId: -1,
    deviceName: "",
    companyName: "",
    contactPerson: "",
    phoneNumber: "",
    carPlate: "",
    msgType: "",
  },
  isGPSNotFound: false,
};

export const IIncidentPageReducer = (
  state: IIncidentPageState = initialState,
  action: IIncidentPageAction
): IIncidentPageState => {
  switch (action.type) {
    case "@@incidentPage/loadData":
      return {
        ...state,
        incidentPage: {
          incidentId: action.data.incidentId ?? state.incidentPage.incidentId,
          vehicleId: action.data.vehicleId ?? state.incidentPage.vehicleId,
          deviceEui: action.data.deviceEui ?? state.incidentPage.deviceEui,
          date: action.data.date ?? state.incidentPage.date,
          longitude: action.data.longitude ?? state.incidentPage.longitude,
          latitude: action.data.latitude ?? state.incidentPage.latitude,
          deviceId: action.data.deviceId ?? state.incidentPage.deviceId,
          deviceName: action.data.deviceName ?? state.incidentPage.deviceName,
          companyName: action.data.companyName ?? state.incidentPage.companyName,
          contactPerson: action.data.contactPerson ?? state.incidentPage.contactPerson,
          phoneNumber: action.data.phoneNumber ?? state.incidentPage.phoneNumber,
          carPlate: action.data.carPlate ?? state.incidentPage.carPlate,
          address: action.data.address ?? state.incidentPage.address,
          msgType: action.data.msgType ?? state.incidentPage.msgType,
        },
      };
    case "@@incidentPage/setGeolocation":
      return {
        ...state,
        incidentPage: {
          ...state.incidentPage,
          longitude: action.data.longitude,
          latitude: action.data.latitude,
        },
      };
    case "@@incidentPage/setIsGPSNotFound":
      return {
        ...state,
        isGPSNotFound: action.isNotFound,
      };
    default:
      return state;
  }
};
