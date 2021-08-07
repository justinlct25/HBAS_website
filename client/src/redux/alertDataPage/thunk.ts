import { setIsLoadingAction } from "../loading/action";
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
          `${REACT_APP_API_SERVER}`
        );
        url.searchParams.set("msg", "A");
        url.searchParams.set("page", String(activePage));
        if (!!searchString) url.searchParams.set("search", searchString);

        const res = await fetch(url.toString());

        if (res.status === 200) {
          const result = await res.json();
          console.log(result);
          dispatch(
            setAlertDataList(
              result.data,
              activePage,
              result.pagination.lastPage,
              result.perPage
            )
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setIsLoadingAction(false));
      }
    }, 800);
  };
}
