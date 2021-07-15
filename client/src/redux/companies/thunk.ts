import { Dispatch } from 'redux';
import { ICompaniesDataActions, resetCompaniesDataList, setCompaniesDataList } from './action';

const { REACT_APP_API_SERVER } = process.env;

export function getCompaniesDataListThunk(activePage: number, isInit: boolean, searchType:string, searchString:string){
    return async (dispatch: Dispatch<ICompaniesDataActions>)=>{
        try {
            if(isInit){
                dispatch(resetCompaniesDataList());
            }

            const res = await fetch(`${REACT_APP_API_SERVER}/companies?page=${activePage}&searchType=${searchType}&searchString=${searchString}`);

            if(res.status === 200){
                const data = await res.json();
                dispatch(setCompaniesDataList(
                    data.companies,
                    activePage,
                    data.totalPage,
                    data.limit
                ));
            }
            return;
        } catch (err) {
            console.error(err);
            //handle error
            return;
        }
    }
}