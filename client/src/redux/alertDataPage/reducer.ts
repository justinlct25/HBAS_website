import { IAlertDataPageState, initAlertDataPageState } from "./state";
import { IAlertDataPageActions } from "./action";

export const IAlertDataPageReducer = (
  state: IAlertDataPageState = initAlertDataPageState,
  action: IAlertDataPageActions
): IAlertDataPageState => {
  switch (action.type) {
    case "@@AlertDataPage/SET_AlertDataList":
      return {
        ...state,
        alertDataList: action.alertDataList,
        activePage: action.activePage,
        totalPage: action.totalPage,
        limit: action.limit,
      };
    case "@@AlertDataPage/setAlertData":
      return {
        ...state,
        alertDataList: action.alertData,
      };
    case "@@AlertDataPage/RESET":
      return {
        ...state,
        alertDataList: initAlertDataPageState.alertDataList,
        activePage: initAlertDataPageState.activePage,
        totalPage: initAlertDataPageState.totalPage,
        limit: initAlertDataPageState.limit,
      };
    default:
      return state;
  }
};
