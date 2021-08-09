import axios from "axios";
import { handleAxiosError } from "../login/thunk";
import { ThunkDispatch } from "../store";
import { resetCompaniesDataList, setCompaniesDataList } from "./action";

const { REACT_APP_API_SERVER, REACT_APP_API_VERSION } = process.env;

export function getCompaniesDataListThunk(activePage: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      dispatch(resetCompaniesDataList());

      // construct api url with (or without) search params
      const url = new URL(
        `${REACT_APP_API_VERSION}/companies`,
        REACT_APP_API_SERVER
      );
      url.searchParams.set("page", String(activePage));
      url.searchParams.set("rows", String(10));

      const res = await axios.get(url.toString());
      const data = await res.data;
      dispatch(
        setCompaniesDataList(
          data.data,
          activePage,
          data.pagination.lastPage,
          data.limit
        )
      );
    } catch (error) {
      dispatch(handleAxiosError(error));
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
      const res = await axios.post(`/companies`, {
        companyName,
        tel,
        contactPerson,
      });
      const companyRes = res.data;

      if (vehicles.length > 0) {
        await axios.post(`/vehicles/company-id/${companyRes.id}`, {
          vehicles,
        });
      }
    } catch (error) {
      dispatch(handleAxiosError(error));
    } finally {
      dispatch(getCompaniesDataListThunk(1));
    }
  };
}
