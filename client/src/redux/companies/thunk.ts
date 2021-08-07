import httpStatusCodes from "http-status-codes";
import { Dispatch } from "redux";
import { headers } from "../../helpers/headers";
import {
  ICompaniesDataActions,
  resetCompaniesDataList,
  setCompaniesDataList,
  errorCompaniesInput,
} from "./action";

const { REACT_APP_API_SERVER, REACT_APP_API_VERSION } = process.env;

export function getCompaniesDataListThunk(activePage: number) {
  return async (dispatch: Dispatch<ICompaniesDataActions>) => {
    try {
      dispatch(resetCompaniesDataList());

      // construct api url with (or within) search params
      const url = new URL(
        `${REACT_APP_API_VERSION}/companies`,
        `${REACT_APP_API_SERVER}`
      );
      url.searchParams.set("page", String(activePage));

      const res = await fetch(url.toString());

      if (res.status === 200) {
        const data = await res.json();
        dispatch(
          setCompaniesDataList(
            data.data,
            activePage,
            data.pagination.lastPage,
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
  return async (
    dispatch: Dispatch<ICompaniesDataActions>,
    dispatch2: Dispatch<ICompaniesDataActions>
  ) => {
    try {
      const { companyName, tel, contactPerson } = companyDetail;
      const res = await fetch(
        `${REACT_APP_API_SERVER}${REACT_APP_API_VERSION}/companies`,
        {
          method: "post",
          headers,
          body: JSON.stringify({
            companyName,
            tel,
            contactPerson,
          }),
        }
      );
      if (res.status === 201 || res.status === 200) {
        const companyRes = await res.json();
        if (vehicles.length > 0) {
          const res = await fetch(
            `${REACT_APP_API_SERVER}${REACT_APP_API_VERSION}/vehicles/company-id/${companyRes.id}`,
            {
              method: "post",
              headers,
              body: JSON.stringify({ vehicles }),
            }
          );

          // ????????? don't know wts this, pls fix
          // ????????? don't know wts this, pls fix
          // ????????? don't know wts this, pls fix
          // ????????? don't know wts this, pls fix
          if (res.status === 201 || res.status === 200) {
            const result = await res.json();
            if (result.data.length > 0 || result.blank > 0) {
              alert(`${result.message}`);
            }
            dispatch(errorCompaniesInput(false));
            //@ts-ignore
            dispatch(getCompaniesDataListThunk(1, true, "Select", ""));
            return;
          } else if (res.status === httpStatusCodes.CONFLICT) {
            const result = await res.json();
            alert(
              `${result.message}${
                !!result.existingCarPlates.length ?? result.existingCarPlates
              }`
            );
          }
        }
        dispatch(errorCompaniesInput(false));
      }
      if (res.status === 400) {
        const result = await res.json();
        alert(result.message);
        dispatch(errorCompaniesInput(true));
      }
      return;
    } catch (err) {
      console.error(err);
      //handle error
      dispatch(errorCompaniesInput(true));
      return;
    } finally {
      //@ts-ignore
      dispatch(getCompaniesDataListThunk(1, true, "Select", ""));
    }
  };
}
