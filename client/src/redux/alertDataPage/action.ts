import { CallHistoryMethodAction } from "connected-react-router";
import { IAlertDataPage } from "./state";

export function setAlertDataList(
  alertDataList: Array<IAlertDataPage>,
  activePage: number,
  totalPage: number,
  limit: number
) {
  return {
    type: "@@AlertDataPage/SET_AlertDataList" as const,
    alertDataList,
    activePage,
    totalPage,
    limit,
  };
}

export function setAlertData(alertData: Array<IAlertDataPage>) {
  return {
    type: "@@AlertDataPage/setAlertData" as const,
    alertData,
  };
}

export function resetAlertDataList() {
  return {
    type: "@@AlertDataPage/RESET" as const,
  };
}

type AlertDataPageActionCreators =
  | typeof setAlertDataList
  | typeof resetAlertDataList
  | typeof setAlertData;

export type IAlertDataPageActions =
  | ReturnType<AlertDataPageActionCreators>
  | CallHistoryMethodAction;
