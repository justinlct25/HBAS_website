import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import AssignDeviceModal from "../components/AssignDeviceModal";
import { CaretIcon, SearchIcon } from "../components/IconsOnly";
import {
  setDeviceIdAction,
  setPopUpIsActiveAction,
} from "../redux/assignDeviceModal/action";
import { getDeviceDataListThunk } from "../redux/devices/thunk";
import { IRootState } from "../redux/store";
import { manageDeviceTableHeaders } from "../table/tableHeader";

const tableHeaders = manageDeviceTableHeaders;
const itemPerPage = 10;
const TABLE_WIDTH = "75%";
const serverUrl = process.env.REACT_APP_API_SERVER;

export type ModalType = "company" | "carPlate" | "device";

function ManageDevice() {
  const [isOpen, setIsOpen] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");
  const [searchInput, setSearchInput] = useState("");

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

    //????????????
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
                    onClick={() => {
                      dispatch(setPopUpIsActiveAction(true));
                      dispatch(setDeviceIdAction(item.id, item.device_eui));
                    }}
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
        <AssignDeviceModal />

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
