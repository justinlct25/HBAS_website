import axios from "axios";
import { IVehicleDetail } from "../../models/resModels";
import { handleAxiosError } from "../login/thunk";
import { ThunkDispatch } from "../store";
import { resetProfileList, setProfileList } from "./action";

export function getProfileListThunk(id: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      dispatch(resetProfileList());
      const res = await axios.get<{ data: IVehicleDetail[] }>(`/vehicles/company-id/${id}`);
      const result = res.data;
      dispatch(setProfileList(result.data));
    } catch (error) {
      dispatch(handleAxiosError(error));
    }
  };
}
