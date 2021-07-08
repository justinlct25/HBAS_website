export interface ICompaniesData {
    id: number;
    company_name: string;
    tel: string;
    contact_person: string;
    count: string;
}

export interface ICompaniesDataState{
    companiesDataList: Array<ICompaniesData>;
}

export const initCompaniesDataState: ICompaniesDataState ={
    companiesDataList: [],
}