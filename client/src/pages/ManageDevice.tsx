import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssignDeviceModal from "../components/AssignDeviceModal";
import { CaretIcon, SearchIcon } from "../components/IconsOnly";
import { toHexAndSplit } from "../helpers/eui_decoder";
import {
  setDeviceIdAction,
  setPopUpIsActiveAction,
  setSelectedItemAction
} from "../redux/assignDeviceModal/action";
import { getDeviceDataListThunk } from "../redux/devices/thunk";
import { IRootState } from "../redux/store";
import { manageDeviceTableHeaders } from "../table/tableHeader";

const tableHeaders = manageDeviceTableHeaders;
const itemPerPage = 10;
const TABLE_WIDTH = "70%";

export type ModalType = "company" | "carPlate" | "device";

function ManageDevice() {
  const [isOpen, setIsOpen] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");
  const [searchInput, setSearchInput] = useState("");

  const devicesDataList = useSelector(
    (state: IRootState) => state.devicesDataList
  );

  const popUpIsActive = useSelector(
    (state: IRootState) => state.assignDevice.assignDeviceModal.popUpIsActive
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDeviceDataListThunk(activePage));
  }, [dispatch, popUpIsActive]);

  const devicesList = devicesDataList.devicesDataList;
  const activePage = devicesDataList.activePage;
  const totalPage = devicesDataList.totalPage;

  // const limit = devicesDataList.limit;

  // useEffect(() => {
  //   const socket = io(`${serverUrl}`);

  //   //????????????
  //   socket.on("get-new-devices", () => {
  //     dispatch(
  //       getDeviceDataListThunk(activePage, false, placeHolderText, searchInput)
  //     );
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // });

  return (
    <>
      <div className="flex-center pageContainer">
        <div className="flex-center topRowContainer">
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
                        dispatch(getDeviceDataListThunk(1));
                      }
                    : () => {}
                }
              >
                <SearchIcon />
              </div>
            </div>
          </div>
          <div />
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
        </div>
        <div
          className="table"
          style={{
            minWidth: TABLE_WIDTH,
            marginBottom: "unset",
            height: `${itemPerPage * 60}px`,
          }}
        >
          <div
            className="flex-center tableHeader"
            style={{ width: TABLE_WIDTH, minHeight: "64px" }}
          >
            {tableHeaders.map((item, idx) => {
              if (item === "Device ID") {
                return (
                  <div key={item + idx} className="flex-center thMainItem">
                    {item}
                  </div>
                );
              } else {
                return (
                  <div key={item + idx} className="flex-center thItem">
                    {item}
                  </div>
                );
              }
            })}
          </div>
          <div className="tableBody" style={{ width: TABLE_WIDTH }}>
            {devicesList &&
              devicesList.length > 0 &&
              devicesList.map((item, idx) => {
                return (
                  <div
                    key={item.deviceId}
                    className="flex-center tableRow"
                    onClick={() => {
                      dispatch(setPopUpIsActiveAction(true));
                      dispatch(
                        setDeviceIdAction(item.deviceId, item.deviceEui)
                      );
                      dispatch(
                        setSelectedItemAction({
                          vehicleId: item.vehicleId,
                          carPlate: item.carPlate,
                          companyId: item.companyId,
                          companyName: item.companyName,
                        })
                      );
                    }}
                  >
                    <div key={idx} className="flex-center tdMainItem">
                      {toHexAndSplit(item.deviceEui)}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.carPlate}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.companyName}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.tel}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.contactPerson}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <AssignDeviceModal />

        <div
          className="flex-center"
          style={{ width: "100%", maxHeight: "12vh" }}
        >
          <div
            style={{
              margin: "16px",
              fontSize: "30px",
              cursor: "pointer",
              color: activePage === 1 ? "#CCC" : "#555",
            }}
            onClick={
              activePage === 1
                ? () => {}
                : () => {
                    dispatch(getDeviceDataListThunk(activePage - 1));
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
              cursor: "pointer",
              color: activePage !== totalPage ? "#555" : "#CCC",
            }}
            onClick={
              activePage !== totalPage
                ? () => {
                    if (activePage >= totalPage) {
                      return;
                    }
                    dispatch(getDeviceDataListThunk(activePage + 1));
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
