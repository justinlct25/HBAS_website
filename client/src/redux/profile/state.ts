export interface IProfile {
  id: number;
  company_name: string;
  contact_person: string;
  tel: string;
  vehicle_id: number;
  car_plate: string;
  vehicle_model: string;
  vehicle_type: string;
  device_id: number;
  device_name: string;
  device_eui: string;
}

export interface IProfileState {
  profileList: Array<IProfile>;
}

export const initProfileState: IProfileState = {
  profileList: [],
};
