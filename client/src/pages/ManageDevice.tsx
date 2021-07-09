import { push } from "connected-react-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddIcon,
  CaretIcon,
  SearchIcon,
  CloseIcon,
} from "../components/IconsOnly";
import { getAlertDataListThunk } from "../redux/alertDataPage/thunk";
import { getCompaniesDataListThunk } from "../redux/companies/thunk";
import { getDeviceDataListThunk } from "../redux/devices/thunk";
import { IRootState } from "../redux/store";
import { manageDeviceTableHeaders } from "../table/tableHeader";

const tableHeaders = manageDeviceTableHeaders;
const TABLE_WIDTH = "75%";

function ManageDevice() {
  const [isOpen, setIsOpen] = useState(false);
  const [popUpIsActive, setPopUpIsActive] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");
  const dispatch = useDispatch();

  const companiesDataList = useSelector(
    (state: IRootState) => state.companiesDataList
  );
  const alertDataPage = useSelector((state: IRootState) => state.alertDataPage);
  const alertDataList = alertDataPage.alertDataList;
  useEffect(() => {
    dispatch(getAlertDataListThunk(1, false));
  }, [dispatch]);

  // const companiesList = companiesDataList.companiesDataList;

  useEffect(() => {
    dispatch(getCompaniesDataListThunk(false));
  }, [dispatch]);

  const [totalVehicle, setTotalVehicle] = useState<
    Array<{
      carPlate: string;
      vehicleType: string;
      vehicleModel: string;
    }>
  >([]);
  const [vehicleInput, setVehicleInput] = useState({
    carPlate: "",
    vehicleType: "",
    vehicleModel: "",
  });
  const devicesDataList = useSelector(
    (state: IRootState) => state.devicesDataList
  );

  const devicesList = devicesDataList.devicesDataList;

  useEffect(() => {
    dispatch(getDeviceDataListThunk(false));
  }, [dispatch]);

  return (
    <>
      <div className="flex-center pageContainer">
        <div className="flex-center topRowContainer">
          <div
            className="flex-center"
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              setPopUpIsActive(true);
            }}
          >
            <AddIcon />
            <div
              style={{
                paddingLeft: "8px",
              }}
            >
              Add new device
            </div>
          </div>
          <div className="flex-center">
            <div style={{ padding: "8px" }}>Search by:</div>
            <div
              style={{
                color: placeHolderText === "Select" ? "#ccc" : "#555",
                minWidth: "64px",
                transition: "all 1s ease",
              }}
            >
              {placeHolderText}
            </div>
            <div
              className="caretIconContainer"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
              onClick={() => setIsOpen(!isOpen)}
            >
              <CaretIcon />
            </div>
            <div className="flex-center" style={{ padding: "8px" }}>
              <input
                className="searchInput"
                placeholder={"Search"}
                style={{
                  width: placeHolderText !== "Select" ? "240px" : "0px",
                }}
              />
              <div style={{ cursor: "pointer", padding: "8px" }}>
                <SearchIcon />
              </div>
            </div>
          </div>
          <div />
          {/* <div style={{ position: "relative" }}> */}
          <div
            className="dropDownListContainer"
            style={{
              zIndex: 1,
              maxHeight: isOpen ? `${(tableHeaders.length + 1) * 64}px` : 0,
            }}
          >
            {isOpen &&
              tableHeaders.map((item, idx) => {
                return (
                  <div
                    key={item + idx}
                    className="flex-center dropDownItem"
                    style={{ height: isOpen ? "48px" : "0px" }}
                    onClick={() => {
                      setPlaceHolderText(item);
                      setIsOpen(false);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
          </div>
          {/* </div> */}
        </div>
        <div className="table" style={{ width: TABLE_WIDTH }}>
          <div
            className="flex-center tableHeader"
            style={{ width: TABLE_WIDTH }}
          >
            {tableHeaders.map((item, idx) => {
              return (
                <div key={item + idx} className="flex-center thItem">
                  {item}
                </div>
              );
            })}
          </div>
          <div className="tableBody" style={{ width: TABLE_WIDTH }}>
            {alertDataList &&
              alertDataList.length > 0 &&
              alertDataList.map((item, idx) => {
                return (
                  <div
                    key={item.id}
                    className="flex-center tableRow"
                    // onClick={() => dispatch(push("/profile"))}
                  >
                    <div key={idx} className="flex-center tdItem">
                      {item.device_eui}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.device_name}
                    </div>
                    <div key={idx} className="tdItem">
                      {`Company name ${idx}`}
                      {/* {companiesDataList.companiesDataList[idx].company_name} */}
                    </div>
                    <div key={idx} className="tdItem">
                      {`Contact person ${idx}`}
                      {/* {companiesDataList.companiesDataList[idx].tel} */}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div
          className={
            popUpIsActive
              ? "flex-center popUpContainer popUp"
              : "flex-center popUpContainer"
          }
        >
          <div className="popUpContent flex-center">
            <div
              className="closeIconContainer"
              onClick={() => setPopUpIsActive(false)}
            >
              <CloseIcon />
            </div>
            <div
              className="flex-center"
              style={{ height: "100%", width: "100%", flexDirection: "column" }}
            >
              <div className="flex-center form">
                <div className="flex-center companySection">
                  <div className="titleText">Company Details</div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Company Name :</div>
                    <div className="formRightColumn">
                      <input className="formInput" />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Contact Person :</div>
                    <div className="formRightColumn">
                      <input className="formInput" />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Phone Number :</div>
                    <div className="formRightColumn">
                      <input className="formInput" />
                    </div>
                  </div>
                </div>
                <div className="flex-center vehicleSection">
                  <div style={{ position: "relative", width: "100%" }}>
                    <div className="titleText">Vehicles</div>
                    {/* <div
                    className="flex-center formAddIconContainer"
                    onClick={() =>
                      setTotalVehicle([...totalVehicle, vehicleInput])
                    }
                  >
                    <AddIcon />
                    <div>Add New Vehicle</div>
                  </div> */}
                  </div>
                  {/* {totalVehicle.map((item, idx) => { */}
                  {/* return ( */}
                  {/* <div style={{ width: "100%" }}> */}
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Car Plate :</div>
                    <div className="formRightColumn">
                      <input
                        className="formInput"
                        value={vehicleInput.carPlate}
                        onChange={(e) =>
                          setVehicleInput({
                            ...vehicleInput,
                            carPlate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Vehicle Type :</div>
                    <div className="formRightColumn">
                      <input
                        className="formInput"
                        value={vehicleInput.vehicleType}
                        onChange={(e) =>
                          setVehicleInput({
                            ...vehicleInput,
                            vehicleType: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Vehicle Model :</div>
                    <div className="formRightColumn">
                      <input
                        className="formInput"
                        value={vehicleInput.vehicleModel}
                        onChange={(e) =>
                          setVehicleInput({
                            ...vehicleInput,
                            vehicleModel: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
              <div className="flex-center formButtonContainer">
                <div className="button" onClick={() => setPopUpIsActive(false)}>
                  Cancel
                </div>
                <div className="button">Confirm</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {devicesList &&
        devicesList.length > 0 &&
        devicesList.map((data, idx) => {
          return (
            <div>
              idx:{idx + 1} DB_id:{data.id} {data.device_eui} {data.device_name}
              {data.car_plate} {data.vehicle_model} {data.vehicle_type}
              {data.company_name} {data.tel} {data.contact_person}
            </div>
          );
        })}
    </>
  );
}

export default ManageDevice;
