import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Container, Table } from "reactstrap";
import AlertDataPagination from "../components/AlertDataPagination";
import AlertDataTable from "../components/AlertDataTable";
import { getAlertDataListThunk } from "../redux/alertDataPage/thunk";
import { IRootState } from "../redux/store";
import "../css/TablePage.css";
import { incidentRecordsTableHeaders } from "../table/tableHeader";
import { CaretIcon, SearchIcon } from "../components/IconsOnly";
import { push } from "connected-react-router";

const tableHeaders = incidentRecordsTableHeaders;
const TABLE_WIDTH = "85%";

function AlertDataPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");
  const alertDataPage = useSelector((state: IRootState) => state.alertDataPage);

  const alertDataList = alertDataPage.alertDataList;
  const activePage = alertDataPage.activePage;
  const totalPage = alertDataPage.totalPage;
  const limit = alertDataPage.limit;

  const dispatch = useDispatch();
  const [idCheck, setIdCheck] = useState<number>(1);

  useEffect(() => {
    dispatch(getAlertDataListThunk(1, false));
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
              style={{
                width: placeHolderText !== "Select" ? "240px" : "0px",
              }}
            />
            <div style={{ cursor: "pointer", padding: "8px" }}>
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
        <div className="tableBody" style={{ width: TABLE_WIDTH }}>
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
                    {item.longitude}
                  </div>
                  <div key={idx} className="flex-center tdItem">
                    {item.latitude}
                  </div>
                  <div key={idx} className="flex-center tdItem">
                    {item.date.substr(0, 10)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
    // <Container>
    //   <Table striped>
    //     <thead>
    //       <tr>
    //         <th>###</th>
    //         <th>date</th>
    //         <th>time</th>
    //         <th>latitude</th>
    //         <th>longitude</th>
    //         <th>battery</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {alertDataList &&
    //         alertDataList.length > 0 &&
    //         alertDataList.map((data, idx) => (
    //           <AlertDataTable
    //             key={idx + 1}
    //             id={idx + idCheck + 1}
    //             date={data.date}
    //             time={data.time}
    //             latitude={data.latitude}
    //             longitude={data.longitude}
    //             battery={data.battery}
    //           />
    //         ))}
    //     </tbody>
    //   </Table>

    //   {alertDataList && alertDataList.length > 0 && (
    //     <AlertDataPagination activePage={activePage} totalPage={totalPage} />
    //   )}
    //   {alertDataList && alertDataList.length === 0 && (
    //     <Alert className="handbrake_data" color="success">
    //       <b>Congratulations! Your have the best parking habits!</b>
    //     </Alert>
    //   )}
    // </Container>
  );
}

export default AlertDataPage;
