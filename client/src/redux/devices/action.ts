import { CallHistoryMethodAction } from 'connected-react-router';
import { IDevicesData } from './state';

export function setDevicesDataList(devicesDataList: Array<IDevicesData>, activePage:number, totalPage:number, limit:number){
    return{
        type: "@@ManageDevice/SET_devicesDataList" as const,
        devicesDataList,
        activePage,
        totalPage,
        limit,
    };
}

export function resetDevicesDataList(){
    return{
        type: "@@ManageDevice/RESET" as const,
    };
}

type DevicesActionCreators = typeof setDevicesDataList | typeof resetDevicesDataList;

export type IDevicesDataActions = ReturnType<DevicesActionCreators> | CallHistoryMethodAction;