//alertdata
import { IAlertDataPageActions } from "./alertDataPage/action";
import { IAlertDataPageState } from "./alertDataPage/state";
import { IAlertDataPageReducer } from "./alertDataPage/reducer";
//companies
import { ICompaniesDataActions } from "./companies/action";
import { ICompaniesDataState } from "./companies/state";
import { ICompaniesDataReducer } from "./companies/reducer";
//devices
import { IDevicesDataActions } from "./devices/action";
import { IDevicesDataState } from "./devices/state";
import { IDevicesDataReducer } from "./devices/reducer";

import { createBrowserHistory } from "history";
import {
  CallHistoryMethodAction,
  connectRouter,
  routerMiddleware,
  RouterState,
} from "connected-react-router";
import thunk, { ThunkDispatch as OldThunkDispatch } from "redux-thunk";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import logger from "redux-logger";

export const history = createBrowserHistory();

// IRootState
export interface IRootState {
  devicesDataList: IDevicesDataState;
  companiesDataList: ICompaniesDataState;
  alertDataPage: IAlertDataPageState;
  router: RouterState;
}

// initState
type IRootAction =
  | IAlertDataPageActions
  | ICompaniesDataActions
  | IDevicesDataActions
  | CallHistoryMethodAction;

// Thunk Dispatch
export type ThunkDispatch = OldThunkDispatch<IRootState, null, IRootAction>;

// createStore
const rootReducer = combineReducers<IRootState>({
  devicesDataList: IDevicesDataReducer,
  companiesDataList: ICompaniesDataReducer,
  alertDataPage: IAlertDataPageReducer,
  router: connectRouter(history),
});

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// createStore
export default createStore<IRootState, IRootAction, {}, {}>(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history))
  )
);
