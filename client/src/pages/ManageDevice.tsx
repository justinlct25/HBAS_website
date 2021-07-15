import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddIcon,
  CaretIcon,
  CloseIcon,
  SearchIcon,
} from "../components/IconsOnly";
import { getDeviceDataListThunk } from "../redux/devices/thunk";
import { IRootState } from "../redux/store";
import { manageDeviceTableHeaders } from "../table/tableHeader";

const tableHeaders = manageDeviceTableHeaders;
const TABLE_WIDTH = "75%";

function ManageDevice() {
  const [isOpen, setIsOpen] = useState(false);
  const [popUpIsActive, setPopUpIsActive] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");
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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDeviceDataListThunk(false));
  }, [dispatch]);

  const devicesList = devicesDataList.devicesDataList;

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
            {devicesList &&
              devicesList.length > 0 &&
              devicesList.map((item, idx) => {
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
                      {item.company_name}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.tel}
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
              <CloseIcon color={"#555"} />
            </div>
            <div
              className="flex-center"
              style={{
                height: "100%",
                width: "100%",
                flexDirection: "column",
              }}
            >
              <div className="flex-center form">
                <div className="flex-center companySection">
                  <div className="titleText">Add new device</div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Device ID :</div>
                    <div className="formRightColumn">
                      <input className="formInput" />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Car plate :</div>
                    <div className="formRightColumn">
                      <input className="formInput" />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Company name :</div>
                    <div className="formRightColumn">
                      <input className="formInput" />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Contact number :</div>
                    <div className="formRightColumn">
                      <input className="formInput" />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Contact person :</div>
                    <div className="formRightColumn">
                      <input className="formInput" />
                    </div>
                  </div>
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
    </>
  );
}

export default ManageDevice;
