import { IAlertDataPageState, initAlertDataPageState } from './state';
import { IAlertDataPageActions } from './action';

export const IAlertDataPageReducer = (state: IAlertDataPageState = initAlertDataPageState, action: IAlertDataPageActions):IAlertDataPageState=>{
    switch (action.type){
        case "@@AlertDataPage/SET_AlertDataList":
            return{
                ...state,
                alertDataList: action.alertData,
                // activePage: action.activePage,
                // nextPage: action.nextPage,
            };
        case "@@AlertDataPage/RESET":
            return{
                ...state,
                alertDataList: initAlertDataPageState.alertDataList,
            }
        default:
            return state;
    }
}