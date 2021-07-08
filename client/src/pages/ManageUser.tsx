import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompaniesDataListThunk } from "../redux/companies/thunk";
import { IRootState } from "../redux/store";

function ManageUser() {
  const companiesDataList = useSelector((state:IRootState)=> state.companiesDataList);

  const companiesList = companiesDataList.companiesDataList; 

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCompaniesDataListThunk(false));
  }, [dispatch]);

  return <div>
    <h1>Manage User</h1>
    {companiesList && companiesList.length > 0 && 
      companiesList.map((data, idx)=>{
        return(
          <div>idx:{idx+1} DB_id:{data.id} {data.company_name} {data.tel} {data.contact_person} count:{data.count}</div>
        )
      })
    }
  </div>;
}

export default ManageUser;
