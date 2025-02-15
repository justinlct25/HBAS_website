import { IDevicesDataState, initDevicesDataState } from "./state";
import { IDevicesDataActions } from "./action";

export const IDevicesDataReducer = (
  state: IDevicesDataState = initDevicesDataState,
  action: IDevicesDataActions
): IDevicesDataState => {
  switch (action.type) {
    case "@@ManageDevice/SET_devicesDataList":
      return {
        ...state,
        devicesDataList: action.devicesDataList,
        activePage: action.activePage,
        totalPage: action.totalPage,
      };
    case "@@ManageDevice/RESET":
      return {
        ...state,
        devicesDataList: initDevicesDataState.devicesDataList,
        activePage: initDevicesDataState.activePage,
        totalPage: initDevicesDataState.totalPage,
      };
    default:
      return state;
  }
};
