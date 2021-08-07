import { AddNewFormAction } from "./action";
import { AddNewFormState } from "./state";

export const initialState: AddNewFormState = {
  addNewForm: {
    isOpen: false,
    modalType: "",
    companyName: "",
    contactPerson: "",
    tel: "",
    vehicles: [
      {
        carPlate: "",
        vehicleType: "",
        vehicleModel: "",
      },
    ],
  },
};

export const addNewFormReducer = (
  state: AddNewFormState = initialState,
  action: AddNewFormAction
): AddNewFormState => {
  switch (action.type) {
    case "@@addNewForm/setAddNewFormOpen":
      return {
        ...state,
        addNewForm: {
          ...state.addNewForm,
          isOpen: action.isOpen,
          modalType: action.modalType,
        },
      };
    case "@@addNewForm/inputCompanyDetails":
      return {
        ...state,
        addNewForm: {
          ...state.addNewForm,
          companyName:
            action.companyDetails.companyName ?? state.addNewForm.companyName,
          contactPerson:
            action.companyDetails.contactPerson ??
            state.addNewForm.contactPerson,
          tel: action.companyDetails.tel ?? state.addNewForm.tel,
        },
      };

    case "@@addNewForm/resetForm":
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
