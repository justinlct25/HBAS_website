import { initProfileState, IProfileState } from './state';
import { IProfileActions } from './action';

export const IProfileReducer = (state: IProfileState = initProfileState, action: IProfileActions):IProfileState => {
    switch (action.type){
        case "@@Profile/setProfileList":
            return{
                ...state,
                profileList: action.profileList,
            };
        case "@@Profile/resetProfileList":
            return{
                ...state,
                profileList: initProfileState.profileList,
            }
        default:
            return state;
    }
}