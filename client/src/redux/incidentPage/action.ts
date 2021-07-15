import { IIncidentPageData } from "./state";

export function setIncidentPageData(data: IIncidentPageData) {
  return {
    type: "@@incidentPage/loadData" as const,
    data,
  };
}

type ActionCreators = typeof setIncidentPageData;

export type IIncidentPageAction = ReturnType<ActionCreators>;
