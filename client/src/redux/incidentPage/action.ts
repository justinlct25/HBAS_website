import { IIncidentPageData } from "./state";

export function setIncidentPageData(data: IIncidentPageData) {
  return {
    type: "@@incidentPage/loadData" as const,
    data,
  };
}
export function setGeolocation(data: { longitude: number; latitude: number }) {
  return {
    type: "@@incidentPage/setGeolocation" as const,
    data,
  };
}
export function setIsGPSNotFound(isNotFound: boolean) {
  return {
    type: "@@incidentPage/setIsGPSNotFound" as const,
    isNotFound,
  };
}

type ActionCreators = typeof setIncidentPageData | typeof setGeolocation | typeof setIsGPSNotFound;

export type IIncidentPageAction = ReturnType<ActionCreators>;
