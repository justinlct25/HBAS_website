import { DeleteModalAction } from "./action";
import { DeleteModalState } from "./state";

export const initialState: DeleteModalState = {
  deleteModal: {
    isOpen: false,
    deleteType: "",
    vehicleId: -1,
    carPlate: "",
    companyId: -1,
    companyName: "",
  },
};

export const deleteModalReducer = (
  state: DeleteModalState = initialState,
  action: DeleteModalAction
): DeleteModalState => {
  switch (action.type) {
    case "@@deleteModal/setDeleteModalOpen":
      return {
        ...state,
        deleteModal: {
          ...state.deleteModal,
          isOpen: action.isOpen,
          deleteType: action.deleteType,
        },
      };
    case "@@deleteModal/setDeleteModalDataAction":
      return {
        ...state,
        deleteModal: {
          ...state.deleteModal,
          vehicleId: action.details.vehicleId ?? state.deleteModal.vehicleId,
          carPlate: action.details.carPlate ?? state.deleteModal.carPlate,
          companyId: action.details.companyId ?? state.deleteModal.companyId,
          companyName:
            action.details.companyName ?? state.deleteModal.companyName,
        },
      };

    case "@@deleteModal/resetDeleteModal":
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
