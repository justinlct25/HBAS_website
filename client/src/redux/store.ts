//alertdata
import {
  CallHistoryMethodAction,
  connectRouter,
  routerMiddleware,
  RouterState,
} from "connected-react-router";
import { createBrowserHistory } from "history";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk, { ThunkDispatch as OldThunkDispatch } from "redux-thunk";
import { IAlertDataPageActions } from "./alertDataPage/action";
import { IAlertDataPageReducer } from "./alertDataPage/reducer";
import { IAlertDataPageState } from "./alertDataPage/state";
//companies
import { ICompaniesDataActions } from "./companies/action";
import { ICompaniesDataReducer } from "./companies/reducer";
import { ICompaniesDataState } from "./companies/state";
//devices
import { IDevicesDataActions } from "./devices/action";
import { IDevicesDataReducer } from "./devices/reducer";
import { IDevicesDataState } from "./devices/state";
//loading
import { ILoadingPageAction } from "./loading/action";
import { ILoadingReducer } from "./loading/reducer";
import { ILoadingState } from "./loading/state";

export const history = createBrowserHistory();

// IRootState
export interface IRootState {
  devicesDataList: IDevicesDataState;
  companiesDataList: ICompaniesDataState;
  alertDataPage: IAlertDataPageState;
  router: RouterState;
  loading: ILoadingState;
}

// initState
type IRootAction =
  | IAlertDataPageActions
  | ICompaniesDataActions
  | IDevicesDataActions
  | CallHistoryMethodAction
  | ILoadingPageAction;

// Thunk Dispatch
export type ThunkDispatch = OldThunkDispatch<IRootState, null, IRootAction>;

// createStore
const rootReducer = combineReducers<IRootState>({
  devicesDataList: IDevicesDataReducer,
  companiesDataList: ICompaniesDataReducer,
  alertDataPage: IAlertDataPageReducer,
  router: connectRouter(history),
  loading: ILoadingReducer,
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
