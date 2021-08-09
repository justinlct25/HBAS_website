const LOGIN_SUCCESS = "@@login/LOGIN_SUCCESS" as const;
const LOGIN_FAILED = "@@login/LOGIN_FAILED" as const;
const LOGOUT_SUCCESS = "@@login/LOGOUT_SUCCESS" as const;
const LOGIN_ERROR = "@@login/LOGIN_ERROR" as const;
const LOGIN_CLEAR_ERROR = "@@login/LOGIN_CLEAR_ERROR" as const;

export function loginSuccess(username: string, token: string) {
  return {
    type: LOGIN_SUCCESS,
    username,
    token,
  };
}

export function loginFailed() {
  return {
    type: LOGIN_FAILED,
  };
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

export function loginError(error: string) {
  return {
    type: LOGIN_ERROR,
    error,
  };
}

export function clearError() {
  return {
    type: LOGIN_CLEAR_ERROR,
    error: null,
  };
}

type ActionCreators =
  | typeof loginSuccess
  | typeof loginFailed
  | typeof logoutSuccess
  | typeof loginError
  | typeof clearError;

export type ILoginActions = ReturnType<ActionCreators>;
