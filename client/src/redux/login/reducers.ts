import { ILoginActions } from "./actions";
import { ILoginState } from "./state";

const initialState: ILoginState = {
  isLoggedIn: null,
  username: null,
  token: "",
  error: null,
};

export function loginReducer(
  state: ILoginState = initialState,
  action: ILoginActions
): ILoginState {
  switch (action.type) {
    case "@@login/LOGIN_SUCCESS":
      return {
        ...state,
        isLoggedIn: true,
        username: action.username,
        token: action.token,
      };
    case "@@login/LOGIN_FAILED":
      return {
        ...state,
        isLoggedIn: false,
        username: null,
        token: "",
      };
    case "@@login/LOGOUT_SUCCESS":
      return {
        ...state,
        isLoggedIn: false,
        username: null,
        token: "",
      };
    case "@@login/LOGIN_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "@@login/LOGIN_CLEAR_ERROR":
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
