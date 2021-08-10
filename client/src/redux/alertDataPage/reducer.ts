import { IAlertDataPageState } from "./state";
import { IAlertDataPageActions } from "./action";

export const initAlertDataPageState: IAlertDataPageState = {
  alertDataList: [],

  activePage: 1,
  totalPage: 10,
  limit: 7,
};

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
