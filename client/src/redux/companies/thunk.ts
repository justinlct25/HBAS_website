import axios from "axios";
import { REACT_APP_API_SERVER, REACT_APP_API_VERSION } from "../../helpers/processEnv";
import { ICompanyInfo, IPagination } from "../../models/resModels";
import { setIsLoadingAction } from "../loading/action";
import { handleAxiosError } from "../login/thunk";
import { ThunkDispatch } from "../store";
import { setCompaniesDataList } from "./action";

export function getCompaniesDataListThunk(activePage: number, searchString?: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(setIsLoadingAction(true));
    try {
      // construct api url with (or without) search params
      const url = new URL(`${REACT_APP_API_VERSION}/companies`, REACT_APP_API_SERVER);
      url.searchParams.set("page", String(activePage));
      url.searchParams.set("rows", String(10));
      if (!!searchString) url.searchParams.set("search", searchString);

      const res = await axios.get<{
        data: ICompanyInfo[];
        pagination: IPagination;
      }>(url.toString());
      const data = res.data;

      dispatch(setCompaniesDataList(data.data, activePage, data.pagination.lastPage));
    } catch (error) {
      dispatch(handleAxiosError(error));
    } finally {
      dispatch(setIsLoadingAction(false));
    }
  };
}

export function postCompaniesDataThunk(
  vehicles: {
    carPlate: string;
    vehicleModel: string | null;
    vehicleType: string | null;
  }[],
  companyDetail: {
    companyName: string;
    tel: string;
    contactPerson: string;
  }
) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const { companyName, tel, contactPerson } = companyDetail;
      const res = await axios.post<{ message: string; id: number }>(`/companies`, {
        companyName,
        tel,
        contactPerson,
      });
      const companyRes = res.data;

      if (vehicles.length > 0) {
        await axios.post<{ message: string; ids: number[] }>(
          `/vehicles/company-id/${companyRes.id}`,
          {
            vehicles,
          }
        );
      }
    } catch (error) {
      dispatch(handleAxiosError(error));
    } finally {
      dispatch(getCompaniesDataListThunk(1));
    }
  };
}
