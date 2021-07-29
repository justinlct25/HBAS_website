import { IProfileActions, setProfileList, resetProfileList } from "./action";
import { Dispatch } from "redux";

const { REACT_APP_API_SERVER } = process.env;

export function getProfileListThunk(id: number, isInit: boolean) {
  return async (dispatch: Dispatch<IProfileActions>) => {
    try {
      dispatch(resetProfileList());
      const res = await fetch(`${REACT_APP_API_SERVER}/profile/${id}`);

      if (res.status === 200) {
        const data = await res.json();
        dispatch(setProfileList(data.data));
      }
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };
}
