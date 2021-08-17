import axios from "axios";
import { REACT_APP_API_SERVER, REACT_APP_API_VERSION } from "../../helpers/processEnv";
import { IAlertData, IPagination } from "../../models/resModels";
import { setIsLoadingAction } from "../loading/action";
import { handleAxiosError } from "../login/thunk";
import { ThunkDispatch } from "../store";
import { setAlertDataList } from "./action";

export function getAlertDataListThunk(activePage: number, searchString?: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(setIsLoadingAction(true));
    setTimeout(async () => {
      try {
        const url = new URL(`${REACT_APP_API_VERSION}/alert-data`, REACT_APP_API_SERVER);
        url.searchParams.set("msg", "A");
        url.searchParams.set("page", String(activePage));
        url.searchParams.set("rows", String(10));
        if (!!searchString) url.searchParams.set("search", searchString);

        const res = await axios.get<{
          data: IAlertData[];
          pagination: IPagination;
        }>(url.toString());
        const result = res.data;
        console.log(result);
        dispatch(setAlertDataList(result.data, activePage, result.pagination.lastPage));
      } catch (error) {
        dispatch(handleAxiosError(error));
      } finally {
        dispatch(setIsLoadingAction(false));
      }
    }, 800);
  };
}
