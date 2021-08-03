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
      if (isInit) {
        dispatch(resetCompaniesDataList());
      }
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
  return async (dispatch: Dispatch<ICompaniesDataActions>, dispatch2: Dispatch<ICompaniesDataActions>) => {
    try {
      const res = await fetch(`${REACT_APP_API_SERVER}/companies`, {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(companyDetail),
      });
      if (res.status === 201 || res.status === 200) {
        const data = await res.json();
        if (totalVehicle.length > 0) {
          const res = await fetch(
            `${REACT_APP_API_SERVER}/vehicles/${data.data}`,
            {
              method: "post",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
              body: JSON.stringify(totalVehicle),
            }
          );
          if (res.status === 201 || res.status === 200) {
            const data = await res.json();
            if(data.data.length > 0 || data.blank > 0){
              alert(`${data.message}`);
            }
            dispatch(errorCompaniesInput(false));
            //@ts-ignore
            dispatch(getCompaniesDataListThunk(1, true, "Select", ""));
            return;
          }
        }
        dispatch(errorCompaniesInput(false));
        //@ts-ignore
        dispatch(getCompaniesDataListThunk(1, true, "Select", ""));
      }
      if (res.status === 400) {
        const data = await res.json();
        alert(`${data.message}: ${data.data} `);
        dispatch(errorCompaniesInput(true));
      }
      //@ts-ignore
      dispatch(getCompaniesDataListThunk(1, true, "Select", ""));
      return;
    } catch (err) {
      console.error(err);
      //handle error
      dispatch(errorCompaniesInput(true));
      return;
    }
  };
}
