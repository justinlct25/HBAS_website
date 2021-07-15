export interface ICompaniesData {
    id: number;
    company_name: string;
    tel: string;
    contact_person: string;
    count: string;
}

export interface ICompaniesDataState{
    companiesDataList: Array<ICompaniesData>;
    activePage: number;
    totalPage: number;
    limit: number;
}

export const initCompaniesDataState: ICompaniesDataState ={
    companiesDataList: [],
    activePage: 1,
    totalPage: 10,
    limit: 7,
}