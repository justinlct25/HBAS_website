import { CallHistoryMethodAction } from "connected-react-router";
import { IAlertDataPage } from "./state";

export function setAlertDataList(
  alertDataList: Array<IAlertDataPage>,
  activePage: number,
  totalPage: number
) {
  return {
    type: "@@AlertDataPage/SET_AlertDataList" as const,
    alertDataList,
    activePage,
    totalPage,
  };
}

export function resetAlertDataList() {
  return {
    type: "@@AlertDataPage/RESET" as const,
  };
}

type AlertDataPageActionCreators =
  | typeof setAlertDataList
  | typeof resetAlertDataList;

export type IAlertDataPageActions =
  | ReturnType<AlertDataPageActionCreators>
  | CallHistoryMethodAction;
