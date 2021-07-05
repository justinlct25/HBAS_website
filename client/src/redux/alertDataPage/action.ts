import { CallHistoryMethodAction } from 'connected-react-router';
import { IAlertDataPage } from './state';

export function setAlertDataList(alertDataList: Array<IAlertDataPage>, activePage:number){//, nextPage:number){
    return{
        type: "@@AlertDataPage/SET_AlertDataList" as const,
        alertDataList, 
        activePage, 
        // nextPage
    };
}

export function resetAlertDataList(){
    return{
        type: "@@AlertDataPage/RESET" as const,
    };
}

type AlertDataPageActionCreators = typeof setAlertDataList | typeof resetAlertDataList;

export type IAlertDataPageActions = ReturnType<AlertDataPageActionCreators> | CallHistoryMethodAction;