import { ILoadingPageAction } from "./action";
import { ILoadingState } from "./state";

export const initIsLoadingState: ILoadingState = {
  loading: {
    isLoading: false,
  },
};

export const ILoadingReducer = (
  state: ILoadingState = initIsLoadingState,
  action: ILoadingPageAction
): ILoadingState => {
  switch (action.type) {
    case "@@loading/setIsLoading":
      return {
        ...state,
        loading: {
          isLoading: action.isLoading,
        },
      };
    default:
      return state;
  }
};
