import { push } from "connected-react-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CaretIcon, SearchIcon } from "../components/IconsOnly";
import Loading from "../components/Loading";
import "../css/TablePage.css";
import { getAlertDataListThunk } from "../redux/alertDataPage/thunk";
import { IRootState } from "../redux/store";
import { incidentRecordsTableHeaders } from "../table/tableHeader";

const tableHeaders = incidentRecordsTableHeaders;
const itemPerPage = 7;
const TABLE_WIDTH = "85%";

function AlertDataPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");
  const [searchInput, setSearchInput] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  const alertDataPage = useSelector((state: IRootState) => state.alertDataPage);

  const alertDataList = alertDataPage.alertDataList;
  const activePage = alertDataPage.activePage;
  const totalPage = alertDataPage.totalPage;
  const limit = alertDataPage.limit;

  const isLoading = useSelector(
    (state: IRootState) => state.loading.loading.isLoading
  );
  const dispatch = useDispatch();
  const [idCheck, setIdCheck] = useState<number>(1);

  useEffect(() => {
    dispatch(getAlertDataListThunk(activePage, true, placeHolderText, searchInput));
  }, [dispatch]);

  useEffect(() => {
    let sum: number = limit * (activePage - 1);
    setIdCheck(sum);
  }, [activePage, limit]);

  return (
    <div className="flex-center pageContainer">
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
                      dispatch(getAlertDataListThunk(1, true, placeHolderText, searchInput));
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
      <div className="table" style={{ width: TABLE_WIDTH }}>
        <div className="flex-center tableHeader" style={{ width: TABLE_WIDTH }}>
          {tableHeaders.map((item, idx) => {
            return (
              <div key={item + idx} className="flex-center thItem">
                {item}
              </div>
            );
          })}
        </div>
        <div
          className="tableBody"
          style={{
            width: TABLE_WIDTH,
            height: `${itemPerPage * 82}px `,
          }}
        >
          {isLoading && <Loading />}
          {alertDataList &&
            alertDataList.length > 0 &&
            alertDataList.map((item, idx) => {
              return (
                <div
                  key={item.device_eui + idx}
                  className=" flex-center tableRow"
                  onClick={() => dispatch(push("/incident"))}
                >
                  <div key={idx} className="flex-center tdItem">
                    {item.device_eui}
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
                    {item.geolocation.x + ',' + item.geolocation.y}
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
          }}
          onClick={
            activePage === 1
              ? () => {}
              : () => {
                  dispatch(getAlertDataListThunk(activePage - 1, false, placeHolderText, searchInput));
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
                  dispatch(getAlertDataListThunk(activePage + 1, false, placeHolderText, searchInput));
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
