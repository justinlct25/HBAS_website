import axios, { AxiosError } from "axios";
import { push } from "connected-react-router";
import httpStatusCodes from "http-status-codes";
import { IRootState, ThunkDispatch } from "../store";
import { clearError, loginError, loginFailed, loginSuccess, logoutSuccess } from "./actions";

export const resetState = () => {
  return async (dispatch: ThunkDispatch) => {};
};

export function login(username: string, password: string) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await axios.post<{ token: string; role: string; devices: number[] | null }>(
        `/login`,
        {
          email: username,
          password,
        }
      );
      console.log(res.data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        dispatch(
          loginSuccess({
            username,
            token: res.data.token,
            role: res.data.role,
            devices: res.data.devices,
          })
        );
        dispatch(push("/alert-data-page"));
      }
      dispatch(clearError());
    } catch (error) {
      if (error.response) {
        if (error.response.status === httpStatusCodes.UNAUTHORIZED) {
          alert("Invalid username or password.");
          dispatch(loginError(error.response.data.message));
        }
      } else {
        console.error(error.message);
      }
      dispatch(loginFailed());
    }
  };
}

export function checkLogin() {
  return async (dispatch: ThunkDispatch) => {
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        dispatch(logoutSuccess());
        dispatch(push("/login"));
        return;
      }
      const res = await axios.get("/login/current-user");
      console.log(res.data);
      if (res.data.email) {
        dispatch(
          loginSuccess({
            username: res.data.email,
            token,
            role: res.data.role,
            devices: res.data.devices,
          })
        );
      }
    } catch (e) {
      dispatch(logoutSuccess());
      dispatch(push("/login"));
    }
  };
}

export function logout() {
  return (dispatch: ThunkDispatch, getState: () => IRootState) => {
    localStorage.removeItem("token");
    dispatch(logoutSuccess());
    dispatch(resetState());
    dispatch(push("/login"));
  };
}

export const handleFetchErrors = (status: number, message: string) => {
  return async (dispatch: ThunkDispatch) => {
    if (status === httpStatusCodes.UNAUTHORIZED) {
      alert("Please login.");
      dispatch(logout());
      return;
    } else {
      alert(message);
      return;
    }
  };
};

export const handleAxiosError = (error: Error & AxiosError) => {
  return async (dispatch: ThunkDispatch) => {
    if (error.response) {
      dispatch(handleFetchErrors(error.response.status, error.response.data.message));
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error(error.message);
    }
  };
};
