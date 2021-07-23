import { Dispatch } from "redux";
import {
  ICompaniesDataActions,
  resetCompaniesDataList,
  setCompaniesDataList,
  errorCompaniesInput,
} from "./action";

const { REACT_APP_API_SERVER } = process.env;

export function getCompaniesDataListThunk(
  activePage: number,
  isInit: boolean,
  searchType: string,
  searchString: string
) {
  return async (dispatch: Dispatch<ICompaniesDataActions>) => {
    try {
      dispatch(resetCompaniesDataList());
      const res = await fetch(
        `${REACT_APP_API_SERVER}/companies?page=${activePage}&searchType=${searchType}&searchString=${searchString}`
      );

      if (res.status === 200) {
        const data = await res.json();
        dispatch(
          setCompaniesDataList(
            data.companies,
            activePage,
            data.totalPage,
            data.limit
          )
        );
      }
      return;
    } catch (err) {
      console.error(err);
      //handle error
      return;
    }
  };
}

export function postCompaniesDataThunk(totalVehicle: any, companyDetail: any) {
  return async (dispatch: Dispatch<ICompaniesDataActions>) => {
    try {
      //console.log(JSON.stringify(companyDetail, totalVehicle))
      let concatD = companyDetail.concat(totalVehicle);
      console.log(concatD);
      console.log("test input data from thunk");
      const res = await fetch(`http://localhost:8085/companies`, {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(concatD),
      });
      if (res.status === 201 || res.status === 200) {
        const data = await res.json();
        console.log("returning from service");
        console.log(data);
        dispatch(errorCompaniesInput(false));
        // @ts-ignore
        dispatch(getCompaniesDataListThunk(1, false, "Select", ""));
      }
      console.log(res);
      return;
    } catch (err) {
      console.error(err);
      //handle error
      dispatch(errorCompaniesInput(true));
      return;
    }
  };
}
