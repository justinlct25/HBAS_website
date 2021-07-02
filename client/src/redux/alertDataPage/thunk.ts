import { Dispatch } from 'redux';
import { IRootState } from '../store';
import { IAlertDataPageActions, resetAlertDataList, setAlertDataList } from './action';

const { REACT_APP_API_SERVER } = process.env;
//  need pageNum, wait to add
export function getAlertDataListThunk( isInit: boolean){
    return async (dispatch: Dispatch<IAlertDataPageActions>, getState:()=> IRootState)=>{
        try {
            if(isInit){
                dispatch(resetAlertDataList());
            }
            console.log('test');
            const res = await fetch(`${REACT_APP_API_SERVER}/alertData`);
            
            if(res.status === 200){
                console.log('before data');
                const data = await res.clone().json();
                console.log('after data');
                //const concatData = getState().alertDataPage.alertDataList.concat(data.data);
                dispatch(setAlertDataList(data));
                console.log(data);
            }
            return;
        } catch (err) {
            console.error(err);
            // handle error
            return;
        }
    }
}