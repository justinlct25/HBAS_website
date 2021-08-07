import { ModalType } from "./state";

export function setAddNewFormOpenAction(isOpen: boolean, modalType: ModalType) {
  return {
    type: "@@addNewForm/setAddNewFormOpen" as const,
    isOpen,
    modalType,
  };
}

export function resetAddNewFormAction() {
  return {
    type: "@@addNewForm/resetForm" as const,
  };
}

export function inputCompanyDetailsAction(companyDetails: {
  companyName?: string;
  tel?: string;
  contactPerson?: string;
}) {
  return {
    type: "@@addNewForm/inputCompanyDetails" as const,
    companyDetails,
  };
}

type ActionCreators =
  | typeof setAddNewFormOpenAction
  | typeof resetAddNewFormAction
  | typeof inputCompanyDetailsAction;

export type AddNewFormAction = ReturnType<ActionCreators>;
