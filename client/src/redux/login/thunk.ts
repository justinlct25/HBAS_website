import axios, { AxiosError } from "axios";
import { push } from "connected-react-router";
import httpStatusCodes from "http-status-codes";
import { IRootState, ThunkDispatch } from "../store";
import {
  clearError,
  loginError,
  loginFailed,
  loginSuccess,
  logoutSuccess,
} from "./actions";

export const resetState = () => {
  return async (dispatch: ThunkDispatch) => {};
};

export function login(email: string, password: string) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await axios.post(`/login`, {
        email,
        password,
      });

      dispatch(clearError());
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        dispatch(loginSuccess(email, res.data.token));
        dispatch(push("/alert-data-page"));
      } else {
        dispatch(loginFailed());
      }
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
      dispatch(
        handleFetchErrors(error.response.status, error.response.data.message)
      );
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error(error.message);
    }
  };
};
