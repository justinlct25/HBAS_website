import axios, { AxiosError } from "axios";
import { push } from "connected-react-router";
import httpStatusCodes from "http-status-codes";
import { history, IRootState, ThunkDispatch } from "../store";
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

export function login(username: string, password: string) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await axios.post(`/login`, {
        username,
        password,
      });

      dispatch(clearError());
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        dispatch(loginSuccess(username, res.data.token));
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

export function checkLogin() {
  return async (dispatch: ThunkDispatch) => {
    const token = localStorage.getItem("token");
    try {
      if (token === null) {
        dispatch(logoutSuccess());
        dispatch(push("/login"));
        return;
      }
      const res = await axios.get("/login/current-user");
      if (res.data.username) {
        dispatch(loginSuccess(res.data.username, token));
      } else {
        dispatch(logoutSuccess());
        dispatch(push("/login"));
      }
    } catch (e) {
      console.error(e.message);
    }
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
