import axios from "axios";
import { setIsLoadingAction } from "../loading/action";
import { handleAxiosError } from "../login/thunk";
import { ThunkDispatch } from "../store";
import { resetAlertDataList, setAlertDataList } from "./action";

const { REACT_APP_API_SERVER, REACT_APP_API_VERSION } = process.env;

export function getAlertDataListThunk(
  activePage: number,
  isInit: boolean,
  searchString?: string
) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(setIsLoadingAction(true));
    setTimeout(async () => {
      try {
        if (isInit) {
          dispatch(resetAlertDataList());
        }

        const url = new URL(
          `${REACT_APP_API_VERSION}/alert-data`,
          REACT_APP_API_SERVER
        );
        url.searchParams.set("msg", "A");
        url.searchParams.set("page", String(activePage));
        url.searchParams.set("rows", String(10));
        if (!!searchString) url.searchParams.set("search", searchString);

        const res = await axios.get(url.toString());
        const result = res.data;
        dispatch(
          setAlertDataList(
            result.data,
            activePage,
            result.pagination.lastPage,
          )
        );
      } catch (error) {
        dispatch(handleAxiosError(error));
      } finally {
        dispatch(setIsLoadingAction(false));
      }
    }, 800);
  };
}
