import { push } from "connected-react-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { SearchIcon } from "../components/IconsOnly";
import Loading from "../components/Loading";
import styles from "../css/anything.module.scss";
import { REACT_APP_API_SERVER } from "../helpers/processEnv";
import { getAlertDataListThunk } from "../redux/alertDataPage/thunk";
import { setIsGPSNotFound } from "../redux/incidentPage/action";
import { IRootState } from "../redux/store";
import { pulseMessageTableHeaders } from "../table/tableHeader";

const tableHeaders = pulseMessageTableHeaders;
const itemPerPage = 10;
const TABLE_WIDTH = "95%";

const BATTERY_MAX = 4.2;
// const BATTERY_MIN = 3.75; //Leifung!!!!!!!!
const BATTERY_MIN = 3.6;
function PulseMessagePage() {
  const [searchInput, setSearchInput] = useState("");
  const alertDataPage = useSelector((state: IRootState) => state.alertDataPage);

  const alertDataList = alertDataPage.alertDataList;
  const activePage = alertDataPage.activePage;
  const totalPage = alertDataPage.totalPage;

  const isLoading = useSelector((state: IRootState) => state.loading.loading.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAlertDataListThunk(1, "", "B"));
  }, [dispatch]);

  useEffect(() => {
    const socket = io(`${REACT_APP_API_SERVER}`);

    socket.on("new-data-type-B", () => {
      dispatch(getAlertDataListThunk(activePage));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const batteryCalculation = (bat: string) => {
    //4.1v
    const battery = parseFloat(bat);
    let percentage = ((battery - BATTERY_MIN) / (BATTERY_MAX - BATTERY_MIN)) * 100;
    if (percentage > 100) {
      percentage = 100;
    }
    if (percentage < 0) {
      percentage = 0;
    }
    return percentage;
    // console.log(
    //   Math.max(
    //     0,
    //     Math.min(
    //       ((battery - BATTERY_MIN) / (BATTERY_MAX - BATTERY_MIN)) * 100,
    //       100
    //     )
    //   )
    // );
    // return Math.max(
    //   0,
    //   Math.min(
    //     ((battery - BATTERY_MIN) / (BATTERY_MAX - BATTERY_MIN)) * 100,
    //     100
    //   )
    // );
  };

  return (
    <div className={`${styles["flex-center"]} ${styles.pageContainer}`}>
      <section className="flex-row-between full-width my-3 px-4">
        <div className="flex1 pageTitle">Pulse Message Page</div>
        <div className="flex-center">
          <div className="flex1 flex-center" style={{ padding: "8px" }}>
            <input
              className="searchInput"
              placeholder={"Search"}
              value={searchInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  dispatch(getAlertDataListThunk(1, searchInput, "B"));
                }
              }}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
            <div
              style={{ cursor: "pointer", padding: "8px" }}
              onClick={() => dispatch(getAlertDataListThunk(1, searchInput))}
            >
              <SearchIcon />
            </div>
          </div>
        </div>
        <div className="flex1"></div>
      </section>
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
          {isLoading && <Loading />}
          {alertDataList &&
            alertDataList.length > 0 &&
            alertDataList.map((item, idx) => {
              return (
                <div
                  key={item.deviceEui + idx}
                  className={`flex-center ${styles.tableRow}`}
                  onClick={async () => {
                    if (item.address === "GPS NOT FOUND") {
                      dispatch(setIsGPSNotFound(true));
                    } else {
                      dispatch(setIsGPSNotFound(false));
                    }
                    dispatch(push(`/incident/${item.id}`));
                  }}
                >
                  <div className="flex-center tdMainItem">{item.deviceEui}</div>
                  <div className="flex-center tdItem">{item.deviceName || "-"}</div>
                  <div className="flex-center tdItem">{item.carPlate || "-"}</div>
                  <div className="flex-center tdItem">{item.companyName || "-"}</div>
                  <div className="flex-center tdItem">
                    {(item.address === "GPS NOT FOUND" ? "HISTORIC RECORD" : item.address) || "-"}
                  </div>
                  <div
                    className="flex-center tdItem"
                    style={{
                      color: batteryCalculation(item.battery) < 18 ? "#F00" : "#555",
                    }}
                  >
                    {batteryCalculation(item.battery).toFixed(2) + "%"}
                  </div>
                  <div className="flex-center tdItem">
                    {`${new Date(item.date).toLocaleDateString("en-CA")} ${new Date(
                      item.date
                    ).toLocaleTimeString([], {
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
            cursor: activePage === 1 ? "default" : "pointer",
          }}
          onClick={
            activePage === 1
              ? () => {}
              : () => {
                  dispatch(getAlertDataListThunk(activePage - 1, searchInput));
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
            cursor: activePage !== totalPage ? "pointer" : "default",
          }}
          onClick={
            activePage !== totalPage
              ? () => {
                  if (activePage >= totalPage) {
                    return;
                  }
                  dispatch(getAlertDataListThunk(activePage + 1, searchInput));
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
