export interface ICompaniesData {
  id: number;
  companyName: string;
  tel: string;
  contactPerson: string;
  vehiclesCount: number;
}

export interface ICompaniesDataState {
  companiesDataList: Array<ICompaniesData>;
  activePage: number;
  totalPage: number;
  limit: number;
  formErrorInput: boolean;
}

export const initCompaniesDataState: ICompaniesDataState = {
  companiesDataList: [],
  activePage: 1,
  totalPage: 10,
  limit: 7,
  formErrorInput: false,
};
