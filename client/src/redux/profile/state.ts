export interface IProfile {
  vehicleId: number;
  carPlate: string;
  vehicleModel: string | null;
  vehicleType: string | null;
  manufactureYear: string | null;
  updatedAt: string;
  deviceId: number;
  deviceName: string;
  deviceEui: string;
}

export interface IProfileState {
  profileList: Array<IProfile>;
}

export const initProfileState: IProfileState = {
  profileList: [],
};
