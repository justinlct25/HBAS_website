import { ICompaniesDataState, initCompaniesDataState } from "./state";
import { ICompaniesDataActions } from "./action";

export const ICompaniesDataReducer = (
  state: ICompaniesDataState = initCompaniesDataState,
  action: ICompaniesDataActions
): ICompaniesDataState => {
  switch (action.type) {
    case "@@ManageUser/SET_companiesDataList":
      return {
        ...state,
        companiesDataList: action.companiesDataList,
        activePage: action.activePage,
        totalPage: action.totalPage,
      };
    case "@@ManageUser/RESET":
      return {
        ...state,
        companiesDataList: initCompaniesDataState.companiesDataList,
        activePage: initCompaniesDataState.activePage,
        totalPage: initCompaniesDataState.totalPage,
        formErrorInput: initCompaniesDataState.formErrorInput,
      };

    case "@@ManageUser/ERROR_handle":
      return {
        ...state,
        formErrorInput: action.formErrorInput,
      };
    default:
      return state;
  }
};
