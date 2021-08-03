import { setIsLoadingAction } from "../loading/action";
import { ThunkDispatch } from "../store";
import { resetAlertDataList, setAlertDataList } from "./action";
// import { IAlertDataPage } from "./state";

const { REACT_APP_API_SERVER } = process.env;
/*
async function getLocationName(dataArray: Array<IAlertDataPage>){
  for ( let i = 0; i < dataArray.length; i++){
      const response = await fetch(`
      https://nominatim.openstreetmap.org/reverse?lat=${dataArray[i]['geolocation']['x']}&lon=${dataArray[i]['geolocation']['y']}&format=json&zoom=16
      `)
      if ( response.status === 200){
        const result = (await response.json())['address'];
        console.log(result);
        if ( result === undefined ){
          dataArray[i]['location'] = {error: 'invalid location'};
        }
        dataArray[i]['location'] = result;
      }else{
        dataArray[i]['location'] = {error: 'network error'};
      }
      console.log(dataArray[i]['location']);
  }
  console.log(dataArray);
  return dataArray;
}
*/
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
        const url = new URL("alertData", `${REACT_APP_API_SERVER}`);
        url.searchParams.set("page", String(activePage));
        if (!!searchType) url.searchParams.set("searchType", searchType);
        if (!!searchString) url.searchParams.set("searchString", searchString);
        
        const res = await fetch(url.toString());

        if (res.status === 200) {
          const data = await res.json();
          // const dataWithLocation = await getLocationName(data.alertData);
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
