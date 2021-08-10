import axios from "axios";
import {
  REACT_APP_API_VERSION,
  REACT_APP_API_SERVER,
} from "../../helpers/processEnv";
import { handleAxiosError } from "../login/thunk";
import { ThunkDispatch } from "../store";
import { resetDevicesDataList, setDevicesDataList } from "./action";

export function getDeviceDataListThunk(activePage: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      dispatch(resetDevicesDataList());

      const url = new URL(
        `${REACT_APP_API_VERSION}/devices`,
        REACT_APP_API_SERVER
      );
      url.searchParams.set("page", String(activePage));
      url.searchParams.set("rows", String(10));

      const res = await axios.get(url.toString());
      const result = res.data;
      dispatch(
        setDevicesDataList(
          result.data,
          activePage,
          result.pagination.lastPage,
          result.pagination.limit
        )
      );
    } catch (error) {
      dispatch(handleAxiosError(error));
    }
  };
}
