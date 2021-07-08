import { IDevicesDataState, initDevicesDataState } from './state';
import { IDevicesDataActions } from './action';

export const IDevicesDataReducer = (state: IDevicesDataState = initDevicesDataState, action: IDevicesDataActions):IDevicesDataState=>{
    switch (action.type){
        case "@@ManageDevice/SET_devicesDataList":
            return{
                ...state,
                devicesDataList: action.devicesDataList,
            };
        case "@@ManageDevice/RESET":
            return{
                ...state,
                devicesDataList: initDevicesDataState.devicesDataList,
            };
        default:
            return state;
    }
}