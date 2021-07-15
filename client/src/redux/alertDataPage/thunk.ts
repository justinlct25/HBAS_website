import { setIsLoadingAction } from "../loading/action";
import { ThunkDispatch } from "../store";
import { resetAlertDataList, setAlertDataList } from "./action";

const { REACT_APP_API_SERVER } = process.env;

export function getAlertDataListThunk(
  activePage: number,
  isInit: boolean,
  searchType?: string,
  searchString?: string
) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(setIsLoadingAction(true));
    setTimeout(async () => {
      try {
        // when the first time press in this page, initial the data list.
        if (isInit) {
          dispatch(resetAlertDataList());
        }
        // fetch the data
        const res = await fetch(
          `${REACT_APP_API_SERVER}/alertData?page=${activePage}&searchType=${searchType}&searchString=${searchString}`
        );

        if (res.status === 200) {
          const data = await res.json();
          dispatch(
            setAlertDataList(
              data.alertData,
              activePage,
              data.totalPage,
              data.limit
            )
          );
        }
        return;
      } catch (err) {
        console.error(err);
        // handle error
        return;
      } finally {
        dispatch(setIsLoadingAction(false));
      }
    }, 800);
  };
}
