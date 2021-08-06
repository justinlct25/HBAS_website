import { push } from "connected-react-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { CaretIcon, SearchIcon } from "../components/IconsOnly";
import Loading from "../components/Loading";
import styles from "../css/anything.module.scss";
import { setAlertData } from "../redux/alertDataPage/action";
import { getAlertDataListThunk } from "../redux/alertDataPage/thunk";
import { setIncidentPageData } from "../redux/incidentPage/action";
import { IRootState } from "../redux/store";
import { pulseMessageTableHeaders } from "../table/tableHeader";

const tableHeaders = pulseMessageTableHeaders;
const itemPerPage = 10;
const TABLE_WIDTH = "95%";

const BATTERY_MAX = 4.2;
const BATTERY_MIN = 3.75;
const { REACT_APP_API_SERVER } = process.env;
function PulseMessagePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");
  const [searchInput, setSearchInput] = useState("");
  const alertDataPage = useSelector((state: IRootState) => state.alertDataPage);

  const alertDataList = alertDataPage.alertDataList;
  const activePage = alertDataPage.activePage;
  const totalPage = alertDataPage.totalPage;

  const isLoading = useSelector(
    (state: IRootState) => state.loading.loading.isLoading
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAlertDataListThunk(1, true));
  }, [dispatch]);

  useEffect(() => {
    const socket = io(`${REACT_APP_API_SERVER}`);

    socket.on("get-new-alertData", () => {
      dispatch(getAlertDataListThunk(activePage, false));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const batteryCalculation = (bat: string) => {
    //4.1v
    const battery = parseFloat(bat);
    return Math.max(
      0,
      Math.min(
        ((battery - BATTERY_MIN) / (BATTERY_MAX - BATTERY_MIN)) * 100,
        100
      )
    );
  };

  return (
    <div className={`${styles["flex-center"]} ${styles.pageContainer}`}>
      <div
        className={`${styles["flex-center"]} ${styles.topRowContainer}`}
        style={{ justifyContent: "center" }}
      >
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
                      dispatch(getAlertDataListThunk(1, true, searchInput));
                    }
                  : () => {}
              }
            >
              <SearchIcon />
            </div>
          </div>
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
      </div>
      <div
        className="table"
        style={{
          width: TABLE_WIDTH,
          marginBottom: "unset",
          height: `${itemPerPage * 60}px`,
        }}
      >
        <div className="flex-center tableHeader" style={{ width: TABLE_WIDTH }}>
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
          {isLoading && <Loading />}
          {alertDataList &&
            alertDataList.length > 0 &&
            alertDataList.map((item, idx) => {
              return (
                <div
                  key={item.deviceEui + idx}
                  className={`flex-center ${styles.tableRow}`}
                  onClick={async () => {
                    dispatch(
                      await setIncidentPageData({
                        date: item.date,
                        time: item.date,
                        longitude: item.geolocation.y,
                        latitude: item.geolocation.x,
                        deviceId: item.deviceEui,
                        deviceName: item.deviceName,
                        companyName: item.companyName,
                        contactPerson: item.companyContactPerson,
                        phoneNumber: item.companyTel,
                        carPlate: item.carPlate,
                      })
                    );

                    dispatch(push(`/incident/${item.id}`));
                  }}
                >
                  <div className="flex-center tdMainItem">{item.deviceEui}</div>
                  <div className="flex-center tdItem">{item.carPlate}</div>
                  <div className="flex-center tdItem">{item.companyName}</div>
                  <div className="flex-center tdItem">{item.companyTel}</div>
                  <div className="flex-center tdItem">{item.address}</div>
                  <div
                    className="flex-center tdItem"
                    style={{
                      color:
                        batteryCalculation(item.battery) < 18 ? "#F00" : "#555",
                    }}
                  >
                    {batteryCalculation(item.battery).toFixed(2) + "%"}
                  </div>
                  <div className="flex-center tdItem">
                    {`${new Date(item.date).toLocaleDateString(
                      "en-CA"
                    )} ${new Date(item.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex-center" style={{ width: "100%" }}>
        <div
          style={{
            margin: "16px",
            fontSize: "30px",
            color: activePage === 1 ? "#CCC" : "#555",
            cursor: "pointer",
          }}
          onClick={
            activePage === 1
              ? () => {}
              : () => {
                  dispatch(getAlertDataListThunk(activePage - 1, false));
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
            cursor: "pointer",
          }}
          onClick={
            activePage !== totalPage
              ? () => {
                  if (activePage >= totalPage) {
                    return;
                  }
                  dispatch(getAlertDataListThunk(activePage + 1, false));
                }
              : () => {}
          }
        >
          {">"}
        </div>
      </div>
    </div>
  );
}

export default PulseMessagePage;
