import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDeviceDataListThunk } from "../redux/devices/thunk";
import { IRootState } from "../redux/store";

function ManageDevice() {
  const devicesDataList = useSelector((state:IRootState)=> state.devicesDataList);

  const devicesList = devicesDataList.devicesDataList;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDeviceDataListThunk(false));
  }, [dispatch]);
  
  return <div>
    <h1>ManageDevice</h1>
    {devicesList && devicesList.length > 0 && 
      devicesList.map((data, idx)=>{
        return(
          <div>idx:{idx+1} DB_id:{data.id} {data.device_eui} {data.device_name} 
          {data.car_plate} {data.vehicle_model} {data.vehicle_type} 
          {data.company_name} {data.tel} {data.contact_person}</div>
        )
      })
    }
  </div>;
}

export default ManageDevice;
