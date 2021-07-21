import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddIcon,
  BackButton,
  CaretIcon,
  CloseIcon,
  SearchIcon,
} from "../components/IconsOnly";
import { getDeviceDataListThunk } from "../redux/devices/thunk";
import { IRootState } from "../redux/store";
import { manageDeviceTableHeaders } from "../table/tableHeader";
import { io } from "socket.io-client";
import { mockNewDevices, mockAllDevices } from "./mockUpData";

const tableHeaders = manageDeviceTableHeaders;
const itemPerPage = 10;
const TABLE_WIDTH = "75%";
const serverUrl = process.env.REACT_APP_API_SERVER;

type DeviceType = "New" | "All";

function ManageDevice() {
  const [isOpen, setIsOpen] = useState(false);
  const [popUpIsActive, setPopUpIsActive] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");
  const [searchInput, setSearchInput] = useState("");
  const [selectDeviceModalOpen, setSelectDeviceModalOpen] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>("New");
  const [selectedDevice, setSelectedDevice] = useState("");

  const devicesDataList = useSelector(
    (state: IRootState) => state.devicesDataList
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getDeviceDataListThunk(activePage, false, placeHolderText, searchInput)
    );
  }, [dispatch]);

  const devicesList = devicesDataList.devicesDataList;
  const activePage = devicesDataList.activePage;
  const totalPage = devicesDataList.totalPage;
  // const limit = devicesDataList.limit;

  useEffect(() => {
    const socket = io(`${serverUrl}`);

    socket.on("get-new-devices", () => {
      dispatch(
        getDeviceDataListThunk(activePage, false, placeHolderText, searchInput)
      );
    });

    return () => {
      socket.disconnect();
    };
  });

  return (
    <>
      <div className="flex-center pageContainer">
        <div className="flex-center topRowContainer">
          <div
            className="flex-center"
            style={{
              position: "absolute",
              cursor: "pointer",
              left: 32,
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
                value={searchInput}
                style={{
                  width: placeHolderText !== "Select" ? "240px" : "0px",
                }}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              />
              <div
                style={{ cursor: "pointer", padding: "8px" }}
                onClick={
                  placeHolderText !== "Select"
                    ? () => {
                        // dispatch() something use value: searchInput & tableHeaders[0]
                        dispatch(
                          getDeviceDataListThunk(
                            1,
                            true,
                            placeHolderText,
                            searchInput
                          )
                        );
                      }
                    : () => {}
                }
              >
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
        <div
          className="table"
          style={{
            width: TABLE_WIDTH,
            marginBottom: "unset",
            height: `${itemPerPage * 60}px`,
          }}
        >
          <div
            className="flex-center tableHeader"
            style={{ width: TABLE_WIDTH, height: "64px" }}
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
                    <div
                      className="flex-center"
                      style={{
                        width: "50%",
                        justifyContent: "flex-start",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setSelectDeviceModalOpen(!selectDeviceModalOpen)
                      }
                    >
                      <div
                        className="flex-center"
                        style={{
                          justifyContent: "flex-start",
                          paddingLeft: "8px",
                        }}
                      >
                        {selectedDevice === ""
                          ? "Select device"
                          : selectedDevice}
                      </div>
                      <div
                        style={{
                          transform: "rotate(180deg)",
                          paddingRight: "8px",
                        }}
                      >
                        <BackButton />
                      </div>
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
                {selectDeviceModalOpen && (
                  <div
                    className="clickElsewhere"
                    onClick={() => setSelectDeviceModalOpen(false)}
                  />
                )}
                <div
                  className="selectDeviceModal"
                  style={{
                    right: selectDeviceModalOpen ? 0 : "-100%",
                  }}
                >
                  <div
                    className="titleText flex-center"
                    style={{ margin: "16px" }}
                  >
                    <div
                      onClick={() => setDeviceType("New")}
                      className="selectDeviceHeader"
                      style={{
                        borderRadius: "8px 0px 0px 8px",
                        background:
                          deviceType === "New"
                            ? "rgba(94, 147, 220, 0.76)"
                            : "transparent",
                      }}
                    >
                      Unassigned devices
                    </div>
                    <div
                      onClick={() => setDeviceType("All")}
                      className="selectDeviceHeader"
                      style={{
                        borderRadius: "0px 8px 8px 0px",
                        background:
                          deviceType === "All"
                            ? "rgba(94, 147, 220, 0.76)"
                            : "transparent",
                      }}
                    >
                      All devices
                    </div>
                  </div>
                  <div className="deviceListContainer">
                    {deviceType === "New"
                      ? mockNewDevices.map((item) => {
                          return (
                            <div
                              className="eachDevice"
                              onClick={() => {
                                setSelectedDevice(item);
                              }}
                            >
                              {item}
                            </div>
                          );
                        })
                      : deviceType === "All" &&
                        mockAllDevices.map((item) => {
                          return (
                            <div
                              className="eachDevice"
                              onClick={() => {
                                setSelectedDevice(item);
                              }}
                            >
                              {item}
                            </div>
                          );
                        })}
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
        <div className="flex-center" style={{ width: "100%" }}>
          <div
            style={{
              margin: "16px",
              fontSize: "30px",
              color: activePage === 1 ? "#CCC" : "#555",
            }}
            onClick={
              activePage === 1
                ? () => {}
                : () => {
                    dispatch(
                      getDeviceDataListThunk(
                        activePage - 1,
                        false,
                        placeHolderText,
                        searchInput
                      )
                    );
                  }
            }
          >
            {"<"}
          </div>
          <div
            className="flex-center"
            style={{
              margin: "16px",
              fontSize: "20px",
            }}
          >
            {"Page " + activePage}
          </div>

          <div
            style={{
              margin: "16px",
              fontSize: "30px",
              color: activePage !== totalPage ? "#555" : "#CCC",
            }}
            onClick={
              activePage !== totalPage
                ? () => {
                    if (activePage >= totalPage) {
                      return;
                    }
                    dispatch(
                      getDeviceDataListThunk(
                        activePage + 1,
                        false,
                        placeHolderText,
                        searchInput
                      )
                    );
                  }
                : () => {}
            }
          >
            {">"}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageDevice;
