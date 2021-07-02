export interface IAlertDataPage {
    id: number;
    device_name:string;
    dev_eui:string;
    data:string;
    date:string;
    time:string;
    latitude:string;
    longitude:string;
    battery:string;
}

export interface IAlertDataPageState{
    alertDataList: Array<IAlertDataPage>;
    //activePage: number;
    //nextPage: number;
}

export const initAlertDataPageState: IAlertDataPageState={
    alertDataList: [],
    //activePage: 1,
    //nextPage: 2,
}