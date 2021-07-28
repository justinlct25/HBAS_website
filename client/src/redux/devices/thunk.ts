import { Dispatch } from "redux";
import {
  IDevicesDataActions,
  resetDevicesDataList,
  setDevicesDataList,
} from "./action";

const { REACT_APP_API_SERVER } = process.env;

export function getDeviceDataListThunk(
  activePage: number,
  isInit: boolean,
  searchType: string,
  searchString: string
) {
  return async (dispatch: Dispatch<IDevicesDataActions>) => {
    try {
      dispatch(resetDevicesDataList());

      const res = await fetch(
        `${REACT_APP_API_SERVER}/devices?page=${activePage}&searchType=${searchType}&searchString=${searchString}`
      );

      if (res.status === 200) {
        const data = await res.json();
        dispatch(
          setDevicesDataList(
            data.devices,
            activePage,
            data.totalPage,
            data.limit
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
