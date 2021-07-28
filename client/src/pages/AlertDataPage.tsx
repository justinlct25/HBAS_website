import { push } from "connected-react-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CaretIcon, SearchIcon } from "../components/IconsOnly";
import Loading from "../components/Loading";
import styles from "../css/anything.module.scss";
// import "../css/TablePage.css";
import { getAlertDataListThunk } from "../redux/alertDataPage/thunk";
import { setIncidentPageData } from "../redux/incidentPage/action";
import { IRootState } from "../redux/store";
import { incidentRecordsTableHeaders } from "../table/tableHeader";
import { io } from "socket.io-client";

const tableHeaders = incidentRecordsTableHeaders;
const itemPerPage = 10;
const TABLE_WIDTH = "85%";
const { REACT_APP_API_SERVER } = process.env;

function AlertDataPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");
  const [searchInput, setSearchInput] = useState("");
  const alertDataPage = useSelector((state: IRootState) => state.alertDataPage);

  const alertDataList = alertDataPage.alertDataList;
  const activePage = alertDataPage.activePage;
  const totalPage = alertDataPage.totalPage;
  //const limit = alertDataPage.limit;

  const isLoading = useSelector(
    (state: IRootState) => state.loading.loading.isLoading
  );
  const dispatch = useDispatch();
  //let [socket, setSocket] = useState< SocketIOClient.Socket | null>(null);

  useEffect(() => {
    dispatch(getAlertDataListThunk(activePage, false));
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

  return (
    // <div className="flex-center pageContainer">
    <div className={`flex-center ${styles.pageContainer}`}>
      <div
        className="flex-center topRowContainer"
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
                      // dispatch() something use value: searchInput & tableHeaders[0]
                      dispatch(
                        getAlertDataListThunk(
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
          {/* </div> */}
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
          {isLoading && <Loading />}
          {alertDataList &&
            alertDataList.length > 0 &&
            alertDataList.map((item, idx) => {
              return (
                <div
                  key={item.device_eui + idx}
                  className={`flex-center ${styles.tableRow}`}
                  onClick={async () => {
                    dispatch(
                      await setIncidentPageData({
                        date: item.date,
                        time: item.time,
                        longitude: item.geolocation.y,
                        latitude: item.geolocation.x,
                        deviceId: item.device_eui,
                        deviceName: item.device_name,
                        companyName: item.company_name,
                        contactPerson: item.contact_person,
                        phoneNumber: item.tel,
                        carPlate: item.car_plate,
                      })
                    );

                    dispatch(push(`/incident/${item.id}`));
                  }}
                >
                  <div key={idx} className="flex-center tdItem">
                    {item.device_eui}
                    {/* {item.id} */}
                  </div>
                  <div key={idx} className="flex-center tdItem">
                    {item.car_plate}
                  </div>
                  <div key={idx} className="flex-center tdItem">
                    {item.company_name}
                  </div>
                  <div key={idx} className="flex-center tdItem">
                    {item.tel}
                  </div>
                  <div key={idx} className="flex-center tdItem">
                    {/* { item.location.county || item.location.city_district || item.location.quarter || item.location.road || item.location.error || ''} */}
                    {item.address}
                  </div>
                  <div key={idx} className="flex-center tdItem">
                    {item.date.substr(0, 10)}
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

export default AlertDataPage;
