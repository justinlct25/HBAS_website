import { CallHistoryMethodAction } from "connected-react-router";
import { ICompaniesData } from "./state";

export function setCompaniesDataList(
  companiesDataList: Array<ICompaniesData>,
  activePage: number,
  totalPage: number
) {
  return {
    type: "@@ManageUser/SET_companiesDataList" as const,
    companiesDataList,
    activePage,
    totalPage,
  };
}

export function resetCompaniesDataList() {
  return {
    type: "@@ManageUser/RESET" as const,
  };
}

export function errorCompaniesInput(formErrorInput: boolean) {
  return {
    type: "@@ManageUser/ERROR_handle" as const,
    formErrorInput,
  };
}

type CompaniesActionCreators =
  | typeof setCompaniesDataList
  | typeof resetCompaniesDataList
  | typeof errorCompaniesInput;

export type ICompaniesDataActions =
  | ReturnType<CompaniesActionCreators>
  | CallHistoryMethodAction;
