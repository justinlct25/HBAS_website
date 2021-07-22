export interface IProfile {
    id: number;
    company_name: string;
    contact_person: string;
    tel: string;
    car_plate: string;
    vehicle_model: string;
    vehicle_type: string; 
    device_name: string;
    device_eui: string;
}

export interface IProfileState {
    profileList: Array<IProfile>;
}

export const initProfileState: IProfileState = {
    profileList: [],
}