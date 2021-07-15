import { CallHistoryMethodAction } from 'connected-react-router';
import { ICompaniesData } from './state';

export function setCompaniesDataList(companiesDataList: Array<ICompaniesData>, activePage:number, totalPage:number, limit:number){
    return{
        type: "@@ManageUser/SET_companiesDataList" as const,
        companiesDataList,
        activePage,
        totalPage,
        limit,
    };
}

export function resetCompaniesDataList(){
    return{
        type: "@@ManageUser/RESET" as const,
    };
}

type CompaniesActionCreators = typeof setCompaniesDataList | typeof resetCompaniesDataList;

export type ICompaniesDataActions = ReturnType<CompaniesActionCreators> | CallHistoryMethodAction;