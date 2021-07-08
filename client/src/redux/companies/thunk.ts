import { Dispatch } from 'redux';
import { ICompaniesDataActions, resetCompaniesDataList, setCompaniesDataList } from './action';

const { REACT_APP_API_SERVER } = process.env;

export function getCompaniesDataListThunk(isInit: boolean){
    return async (dispatch: Dispatch<ICompaniesDataActions>)=>{
        try {
            if(isInit){
                dispatch(resetCompaniesDataList());
            }

            const res = await fetch(`${REACT_APP_API_SERVER}/companies`);

            if(res.status === 200){
                const data = await res.json();
                dispatch(setCompaniesDataList(data.companies));
                console.log(data.companies);
            }
            return;
        } catch (err) {
            console.error(err);
            //handle error
            return;
        }
    }
}