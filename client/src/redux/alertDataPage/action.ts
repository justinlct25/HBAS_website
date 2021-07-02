import { CallHistoryMethodAction } from 'connected-react-router';
import { IAlertDataPage } from './state';

export function setAlertDataList(alertData: Array<IAlertDataPage>){//, activePage:number, nextPage:number){
    return{
        type: "@@AlertDataPage/SET_AlertDataList" as const,
        alertData, 
        // activePage, 
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