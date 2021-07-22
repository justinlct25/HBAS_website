import { CallHistoryMethodAction } from 'connected-react-router';
import { IProfile } from './state';

export function setProfileList(profileList: Array<IProfile>){
    return{
        type: "@@Profile/setProfileList" as const,
        profileList,
    };
}

type profileActionCreators = typeof setProfileList;

export type IProfileActions = ReturnType<profileActionCreators> | CallHistoryMethodAction;