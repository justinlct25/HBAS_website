export interface IDevicesData {
    id: number;
    device_name: string;
    device_eui: string;
    car_plate: string;
    vehicle_model: string;
    vehicle_type: string;
    company_name: string;
    tel: string;
    contact_person: string;
}

export interface IDevicesDataState{
    devicesDataList: Array<IDevicesData>;
    activePage: number;
    totalPage: number;
    limit: number;
}

export const initDevicesDataState: IDevicesDataState = {
    devicesDataList: [],
    activePage: 1,
    totalPage: 10,
    limit: 7,
}