import { IIncidentPageAction } from "./action";
import { IIncidentPageState } from "./state";

export const initialState: IIncidentPageState = {
  incidentPage: {
    date: "",
    time: "",
    longitude: -1,
    latitude: -1,
    deviceId: "",
    deviceName: "",
    companyName: "",
    contactPerson: "",
    phoneNumber: "",
    carPlate: "",
  },
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
          date: action.data.date,
          time: action.data.time,
          longitude: action.data.longitude,
          latitude: action.data.latitude,
          deviceId: action.data.deviceId,
          deviceName: action.data.deviceName,
          companyName: action.data.companyName,
          contactPerson: action.data.contactPerson,
          phoneNumber: action.data.phoneNumber,
          carPlate: action.data.carPlate,
        },
      };
    default:
      return state;
  }
};
