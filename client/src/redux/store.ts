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
import { AddNewFormAction } from "./addNewForm/action";
import { addNewFormReducer } from "./addNewForm/reducer";
import { AddNewFormState } from "./addNewForm/state";
import { IAlertDataPageActions } from "./alertDataPage/action";
import { IAlertDataPageReducer } from "./alertDataPage/reducer";
import { IAlertDataPageState } from "./alertDataPage/state";
import { AssignDeviceAction } from "./assignDeviceModal/action";
import { assignDeviceReducer } from "./assignDeviceModal/reducer";
import { AssignDeviceState } from "./assignDeviceModal/state";
//companies
import { ICompaniesDataActions } from "./companies/action";
import { ICompaniesDataReducer } from "./companies/reducer";
import { ICompaniesDataState } from "./companies/state";
import { DeleteModalAction } from "./deleteModal/action";
import { deleteModalReducer } from "./deleteModal/reducer";
import { DeleteModalState } from "./deleteModal/state";
//devices
import { IDevicesDataActions } from "./devices/action";
import { IDevicesDataReducer } from "./devices/reducer";
import { IDevicesDataState } from "./devices/state";
import { IGlobalAction } from "./global/action";
import { IGlobalReducer } from "./global/reducer";
import { IGlobalState } from "./global/state";
//incidentPage
import { IIncidentPageAction } from "./incidentPage/action";
import { IIncidentPageReducer } from "./incidentPage/reducer";
import { IIncidentPageState } from "./incidentPage/state";
//loading
import { ILoadingPageAction } from "./loading/action";
import { ILoadingReducer } from "./loading/reducer";
import { ILoadingState } from "./loading/state";
import { ILoginActions } from "./login/actions";
import { loginReducer } from "./login/reducers";
import { ILoginState } from "./login/state";
import { SetNotificationAction } from "./notification/action";
import { notificationReducer } from "./notification/reducer";
import { NotificationState } from "./notification/state";
//profile
import { IProfileActions } from "./profile/action";
import { IProfileReducer } from "./profile/reducer";
import { IProfileState } from "./profile/state";

export const history = createBrowserHistory();

// IRootState
export interface IRootState {
  global: IGlobalState;
  login: ILoginState;
  devicesDataList: IDevicesDataState;
  companiesDataList: ICompaniesDataState;
  alertDataPage: IAlertDataPageState;
  router: RouterState;
  loading: ILoadingState;
  incidentPage: IIncidentPageState;
  profileList: IProfileState;
  assignDevice: AssignDeviceState;
  addNewForm: AddNewFormState;
  deleteModal: DeleteModalState;
  notification: NotificationState;
}

// initState
type IRootAction =
  | ILoginActions
  | IAlertDataPageActions
  | ICompaniesDataActions
  | IDevicesDataActions
  | CallHistoryMethodAction
  | ILoadingPageAction
  | IIncidentPageAction
  | IProfileActions
  | AssignDeviceAction
  | AddNewFormAction
  | DeleteModalAction
  | SetNotificationAction
  | IGlobalAction;

// Thunk Dispatch
export type ThunkDispatch = OldThunkDispatch<IRootState, null, IRootAction>;

// createStore
const rootReducer = combineReducers<IRootState>({
  global: IGlobalReducer,
  login: loginReducer,
  devicesDataList: IDevicesDataReducer,
  companiesDataList: ICompaniesDataReducer,
  alertDataPage: IAlertDataPageReducer,
  router: connectRouter(history),
  loading: ILoadingReducer,
  incidentPage: IIncidentPageReducer,
  profileList: IProfileReducer,
  assignDevice: assignDeviceReducer,
  addNewForm: addNewFormReducer,
  deleteModal: deleteModalReducer,
  notification: notificationReducer,
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
  composeEnhancers(applyMiddleware(thunk), applyMiddleware(routerMiddleware(history)))
);
