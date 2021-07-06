import { Dispatch } from 'redux';
import { IAlertDataPageActions, resetAlertDataList, setAlertDataList } from './action';

const { REACT_APP_API_SERVER } = process.env;

export function getAlertDataListThunk(activePage:number, isInit: boolean){
    return async (dispatch: Dispatch<IAlertDataPageActions>)=>{
        try {
            // when the first time press in this page, initial the data list.
            if(isInit){
                dispatch(resetAlertDataList());
            }
            // fetch the data
            const res = await fetch(`${REACT_APP_API_SERVER}/alertData?page=${activePage}`)
            
            if(res.status === 200){
                const data = await res.json();
                dispatch(setAlertDataList(data.alertData, activePage, data.totalPage, data.limit));
            }
            return ;
        } catch (err) {
            console.error(err);
            // handle error
            return;
        }
    }
}