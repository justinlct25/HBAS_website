import { Dispatch } from 'redux';
import { IAlertDataPageActions, resetAlertDataList, setAlertDataList } from './action';

const { REACT_APP_API_SERVER } = process.env;
//  need pageNum, wait to add
export function getAlertDataListThunk(activePage:number, isInit: boolean){
    return async (dispatch: Dispatch<IAlertDataPageActions>)=>{
        try {
            if(isInit){
                dispatch(resetAlertDataList());
                console.log('test');
            }
            console.log(activePage);
            const res = await fetch(`${REACT_APP_API_SERVER}/alertData?page=${activePage}`)
            
            if(res.status === 200){
                const data = await res.json();
                dispatch(setAlertDataList(data.alertData, activePage));
            }
            return ;
        } catch (err) {
            console.error(err);
            // handle error
            return;
        }
    }
}