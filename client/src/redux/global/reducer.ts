import { IGlobalAction } from "./action";
import { IGlobalState } from "./state";

export const initIsLoadingState: IGlobalState = {
  global: {
    isOpen: false,
    content: "",
    identifier: "",
  },
};

export const IGlobalReducer = (
  state: IGlobalState = initIsLoadingState,
  action: IGlobalAction
): IGlobalState => {
  switch (action.type) {
    case "@@global/setGlobalModal":
      return {
        ...state,
        global: {
          ...state.global,
          isOpen: action.data.isOpen,
          content: action.data.content ?? state.global.content,
          identifier: action.data.identifier ?? state.global.identifier,
        },
      };
    default:
      return state;
  }
};
