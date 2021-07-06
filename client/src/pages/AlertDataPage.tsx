import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Container, Table } from "reactstrap";
import AlertDataPagination from "../components/AlertDataPagination";
import AlertDataTable from "../components/AlertDataTable";
import { getAlertDataListThunk } from "../redux/alertDataPage/thunk";
import { IRootState } from "../redux/store";
import "../css/Table.css";
import { tableHeaders } from "../table/tableHeader";

function AlertDataPage() {
  const alertDataPage = useSelector((state: IRootState) => state.alertDataPage);

  const alertDataList = alertDataPage.alertDataList;
  const activePage = alertDataPage.activePage;
  const totalPage = alertDataPage.totalPage;
  const limit = alertDataPage.limit;

  const dispatch = useDispatch();
  const [idCheck, setIdCheck] = useState<number>(1);

  useEffect(() => {
    dispatch(getAlertDataListThunk(1, true));
  }, [dispatch]);

  useEffect(() => {
    let sum: number = limit * (activePage - 1);
    setIdCheck(sum);
  }, [activePage, limit]);

  return (
    <div
      className="flex-center"
      style={{
        alignItems: "flex-start",
        width: "100vw",
        height: "calc(100vh - var(--topNavHeight) - 16px)",
        padding: "24px",
      }}
    >
      <div className="table">
        <div className="tableHeader">
          {tableHeaders.map((item, idx) => {
            return (
              <div key={idx} className="thItem">
                {item}
              </div>
            );
          })}
        </div>
        <div className="tableBody">
          {alertDataList &&
            alertDataList.length > 0 &&
            alertDataList.map((item, idx) => {
              return (
                <div className="tableRow" onClick={() => console.log("hihi")}>
                  <div key={idx} className="tdItem">
                    {item.dev_eui}
                  </div>
                  <div key={idx} className="tdItem">
                    {item.device_name}
                  </div>
                  <div key={idx} className="tdItem">
                    {item.device_name}
                  </div>
                  <div key={idx} className="tdItem">
                    {item.longitude}
                  </div>
                  <div key={idx} className="tdItem">
                    {item.latitude}
                  </div>
                  <div key={idx} className="tdItem">
                    {item.date}
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
