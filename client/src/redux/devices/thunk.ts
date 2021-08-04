import { Dispatch } from "redux";
import {
  IDevicesDataActions,
  resetDevicesDataList,
  setDevicesDataList,
} from "./action";

const { REACT_APP_API_SERVER, REACT_APP_API_VERSION } = process.env;

export function getDeviceDataListThunk(activePage: number) {
  return async (dispatch: Dispatch<IDevicesDataActions>) => {
    try {
      dispatch(resetDevicesDataList());

      const url = new URL(
        `${REACT_APP_API_VERSION}/devices`,
        `${REACT_APP_API_SERVER}`
      );
      url.searchParams.set("page", String(activePage));

      const res = await fetch(url.toString());

      if (res.status === 200) {
        const result = await res.json();
        dispatch(
          setDevicesDataList(
            result.data,
            activePage,
            result.pagination.lastPage,
            result.pagination.limit
          )
        );
      }
      return;
    } catch (err) {
      console.error(err.message);
      //handle error
      return;
    }
  };
}
