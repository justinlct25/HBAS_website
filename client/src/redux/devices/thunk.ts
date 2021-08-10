import axios from "axios";
import { REACT_APP_API_SERVER, REACT_APP_API_VERSION } from "../../helpers/processEnv";
import { IDeviceDetail, IPagination } from "../../models/resModels";
import { handleAxiosError } from "../login/thunk";
import { ThunkDispatch } from "../store";
import { resetDevicesDataList, setDevicesDataList } from "./action";

export function getDeviceDataListThunk(activePage: number, searchString?: string) {
  return async (dispatch: ThunkDispatch) => {
    try {
      dispatch(resetDevicesDataList());

      const url = new URL(`${REACT_APP_API_VERSION}/devices`, REACT_APP_API_SERVER);
      url.searchParams.set("page", String(activePage));
      url.searchParams.set("rows", String(10));
      if (!!searchString) url.searchParams.set("search", searchString);

      const res = await axios.get<{
        data: IDeviceDetail[];
        pagination: IPagination;
      }>(url.toString());
      const result = res.data;

      dispatch(setDevicesDataList(result.data, activePage, result.pagination.lastPage));
    } catch (error) {
      dispatch(handleAxiosError(error));
    }
  };
}
