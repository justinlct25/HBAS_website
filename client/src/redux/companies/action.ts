import { CallHistoryMethodAction } from 'connected-react-router';
import { ICompaniesData } from './state';

export function setCompaniesDataList(companiesDataList: Array<ICompaniesData>){
    return{
        type: "@@ManageUser/SET_companiesDataList" as const,
        companiesDataList
    };
}

export function resetCompaniesDataList(){
    return{
        type: "@@ManageUser/RESET" as const,
    };
}

type CompaniesActionCreators = typeof setCompaniesDataList | typeof resetCompaniesDataList;

export type ICompaniesDataActions = ReturnType<CompaniesActionCreators> | CallHistoryMethodAction;