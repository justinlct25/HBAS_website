import { CallHistoryMethodAction } from 'connected-react-router';
import { IProfile } from './state';

export function setProfileList(profileList: Array<IProfile>){
    return{
        type: "@@Profile/setProfileList" as const,
        profileList,
    };
}
export function resetProfileList(){
    return{
        type: "@@Profile/resetProfileList" as const,
    }
}

type profileActionCreators = typeof setProfileList | typeof resetProfileList;

export type IProfileActions = ReturnType<profileActionCreators> | CallHistoryMethodAction;