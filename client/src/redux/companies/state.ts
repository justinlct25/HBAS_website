export interface ICompaniesData {
  id?: number;
  companyName: string;
  tel: string;
  contactPerson: string;
  updatedAt: string;
  vehiclesCount?: string | number;
}

export interface ICompaniesDataState {
  companiesDataList: Array<ICompaniesData>;
  activePage: number;
  totalPage: number;
  formErrorInput: boolean;
}

export const initCompaniesDataState: ICompaniesDataState = {
  companiesDataList: [],
  activePage: 1,
  totalPage: 1,
  formErrorInput: false,
};
