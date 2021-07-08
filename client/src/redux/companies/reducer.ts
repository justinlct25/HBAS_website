import { ICompaniesDataState, initCompaniesDataState } from './state';
import { ICompaniesDataActions } from './action';

export const ICompaniesDataReducer = (state: ICompaniesDataState = initCompaniesDataState, action: ICompaniesDataActions):ICompaniesDataState=>{
    switch (action.type){
        case "@@ManageUser/SET_companiesDataList":
            return{
                ...state,
                companiesDataList: action.companiesDataList,
            };
        case "@@ManageUser/RESET":
            return{
                ...state,
                companiesDataList: initCompaniesDataState.companiesDataList,
            }
        default: 
            return state;
    }
}