import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssignDeviceModal from "../components/AssignDeviceModal";
import { SearchIcon } from "../components/IconsOnly";
import { setPopUpIsActiveAction, setSelectedItemAction } from "../redux/assignDeviceModal/action";
import { getDeviceDataListThunk } from "../redux/devices/thunk";
import { IRootState } from "../redux/store";
import { manageDeviceTableHeaders } from "../table/tableHeader";

const tableHeaders = manageDeviceTableHeaders;
const itemPerPage = 10;
const TABLE_WIDTH = "70%";

export type ModalType = "company" | "carPlate" | "device";

function ManageDevice() {
  const [searchInput, setSearchInput] = useState("");
  const devicesDataList = useSelector((state: IRootState) => state.devicesDataList);

  const popUpIsActive = useSelector(
    (state: IRootState) => state.assignDevice.assignDeviceModal.popUpIsActive
  );
  const dispatch = useDispatch();

  const devicesList = devicesDataList.devicesDataList;
  const activePage = devicesDataList.activePage;
  const totalPage = devicesDataList.totalPage;

  useEffect(() => {
    dispatch(getDeviceDataListThunk(activePage));
  }, [dispatch, popUpIsActive]);

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
            <div className="flex-center" style={{ padding: "8px" }}>
              <input
                className="searchInput"
                placeholder={"Search"}
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    dispatch(getDeviceDataListThunk(1));
                  }
                }}
              />
              <div
                style={{ cursor: "pointer", padding: "8px" }}
                onClick={() => {
                  dispatch(getDeviceDataListThunk(1));
                }}
              >
                <SearchIcon />
              </div>
            </div>
          </div>
          <div />
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
              if (item === "Device EUI") {
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
                        setSelectedItemAction({
                          deviceId: item.deviceId,
                          deviceEui: item.deviceEui,
                          vehicleId: item.vehicleId,
                          carPlate: item.carPlate,
                          companyId: item.companyId,
                          companyName: item.companyName,
                        })
                      );
                    }}
                  >
                    <div key={idx} className="flex-center tdMainItem">
                      {item.deviceEui}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.carPlate || "-"}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.companyName || "-"}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.tel || "-"}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.contactPerson || "-"}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <AssignDeviceModal />

        <div className="flex-center" style={{ width: "100%", maxHeight: "12vh" }}>
          <div
            style={{
              margin: "16px",
              fontSize: "30px",
              cursor: activePage === 1 ? "default" : "pointer",
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
              cursor: activePage !== totalPage ? "pointer" : "default",
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
