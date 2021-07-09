export interface IAlertDataPage {
    id: number;
    device_name:string;
    device_eui:string;
    data:string;
    date:string;
    time:string;
    latitude:string;
    longitude:string;
    battery:string;
}

export interface IAlertDataPageState{
    alertDataList: Array<IAlertDataPage>;
    activePage: number;
    totalPage: number;
    limit:number;
}

export const initAlertDataPageState: IAlertDataPageState={
    alertDataList: [],
    activePage: 1,
    totalPage: 10,
    limit: 5,
}