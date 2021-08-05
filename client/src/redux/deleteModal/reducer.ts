import { DeleteModalAction } from "./action";
import { DeleteModalState } from "./state";

export const initialState: DeleteModalState = {
  deleteModal: {
    isOpen: false,
    vehicleId: -1,
    carPlate: "",
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
        },
      };
    case "@@deleteModal/setDeleteModalDataAction":
      return {
        ...state,
        deleteModal: {
          ...state.deleteModal,
          vehicleId: action.vehicleDeviceDetails.vehicleId,
          carPlate: action.vehicleDeviceDetails.carPlate,
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
