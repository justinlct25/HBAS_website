import { setIsLoadingAction } from "../loading/action";
import { ThunkDispatch } from "../store";
import { resetAlertDataList, setAlertDataList } from "./action";
import { IAlertDataPage } from "./state";

const { REACT_APP_API_SERVER } = process.env;

async function getLocationName(dataArray: Array<IAlertDataPage>){
  for ( let i = 0; i < dataArray.length; i++){
      const response = await fetch(`
      https://nominatim.openstreetmap.org/reverse?lat=${dataArray[i]['geolocation']['x']}&lon=${dataArray[i]['geolocation']['y']}&format=json&zoom=16
      `)
      const result = (await response.json())['address'];
      dataArray[i]['location'] = result;
  }
  return dataArray;
}

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
          const dataWithLocation = await getLocationName(data.alertData);
          dispatch(
            setAlertDataList(
              dataWithLocation,
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
