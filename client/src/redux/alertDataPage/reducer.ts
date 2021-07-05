import { IAlertDataPageState, initAlertDataPageState } from './state';
import { IAlertDataPageActions } from './action';

export const IAlertDataPageReducer = (state: IAlertDataPageState = initAlertDataPageState, action: IAlertDataPageActions):IAlertDataPageState=>{
    switch (action.type){
        case "@@AlertDataPage/SET_AlertDataList":
            return{
                ...state,
                alertDataList: action.alertDataList,
                activePage: action.activePage,
                // nextPage: action.nextPage,
            };
        case "@@AlertDataPage/RESET":
            return{
                ...state,
                alertDataList: initAlertDataPageState.alertDataList,
                activePage: initAlertDataPageState.activePage
            };
        default:
            return state;
    }
}