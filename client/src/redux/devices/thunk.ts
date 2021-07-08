import { Dispatch } from 'redux';
import { IDevicesDataActions, resetDevicesDataList ,setDevicesDataList} from './action';

const { REACT_APP_API_SERVER } = process.env;

export function getDeviceDataListThunk(isInit: boolean){
    return async(dispatch: Dispatch<IDevicesDataActions>)=>{
        try {
            if(isInit){
                dispatch(resetDevicesDataList());
            }

            const res = await fetch(`${REACT_APP_API_SERVER}/devices`);

            if(res.status === 200){
                const data = await res.json();
                dispatch(setDevicesDataList(data.devices));
                console.log(data.devices);
            }
            return;
        } catch (err) {
            console.error(err.message);
            //handle error
            return;
        }
    }
}