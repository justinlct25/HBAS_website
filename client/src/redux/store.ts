import { IAlertDataPageActions } from './alertDataPage/action';
import { IAlertDataPageState } from './alertDataPage/state';
import { IAlertDataPageReducer } from './alertDataPage/reducer';
import { createBrowserHistory } from 'history';
import { CallHistoryMethodAction, connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import thunk, { ThunkDispatch as OldThunkDispatch } from 'redux-thunk';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import logger from 'redux-logger';

export const history = createBrowserHistory();

// IRootState
export interface IRootState{
    alertDataPage: IAlertDataPageState;
    router: RouterState;
}

// initState
type IRootAction =  IAlertDataPageActions | CallHistoryMethodAction;

// Thunk Dispatch
export type ThunkDispatch = OldThunkDispatch<IRootState, null, IRootAction>;

// createStore
const rootReducer = combineReducers<IRootState>({
    alertDataPage: IAlertDataPageReducer,
    router: connectRouter(history),
});

declare global{
    interface Window{
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__:any
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// createStore
export default createStore<IRootState, IRootAction,{},{}>(
    rootReducer, 
    composeEnhancers(applyMiddleware(logger), applyMiddleware(thunk), applyMiddleware(routerMiddleware(history)))
)