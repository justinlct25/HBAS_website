import { push } from "connected-react-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BackButton, CaretIcon, SearchIcon } from "../components/IconsOnly";
import "../css/TablePage.css";
import { getAlertDataListThunk } from "../redux/alertDataPage/thunk";
import { IRootState } from "../redux/store";
import { incidentRecordsTableHeaders } from "../table/tableHeader";
import handbrakeMap from "../images/handbrakeMap.png";
import { getCompaniesDataListThunk } from "../redux/companies/thunk";

const tableHeaders = incidentRecordsTableHeaders;
const TABLE_WIDTH = "85%";

function IncidentPage() {
  const history = useHistory();
  const alertDataPage = useSelector((state: IRootState) => state.alertDataPage);
  const alertDataList = alertDataPage.alertDataList;

  const companiesDataList = useSelector(
    (state: IRootState) => state.companiesDataList
  );
  const companiesList = companiesDataList.companiesDataList;

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getAlertDataListThunk(1, false));
  }, []);
  useEffect(() => {
    //dispatch(getCompaniesDataListThunk(false));
  }, []);

  return (
    <div className="flex-center pageContainer">
      <div
        className="flex-center topRowContainer"
        style={{ justifyContent: "flex-start" }}
      >
        <div
          className="flex-center"
          style={{ cursor: "pointer" }}
          onClick={() => history.goBack()}
        >
          <div className="flex-center">
            <BackButton />
            <div style={{ margin: "8px", fontSize: "24px" }}>BACK</div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "24px 80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            height: "90%",
            width: "40%",
            display: "flex",
          }}
        >
          <img src={handbrakeMap} />
        </div>
        <div
          style={{
            height: "100%",
            // width: "60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            margin: "0 8px",
          }}
        >
          <div className="flex-center">
            <div className="incidentReportText">Date:</div>
            <div className="incidentReportText">{"2020-07-03"}</div>
          </div>
          <div className="flex-center">
            <div className="incidentReportText">Time:</div>
            <div className="incidentReportText">{"20:15:30"}</div>
          </div>
          <div className="flex-center">
            <div className="incidentReportText">Longitude:</div>
            <div className="incidentReportText">{"114.22712"}</div>
          </div>
          <div className="flex-center">
            <div className="incidentReportText">Latitude:</div>
            <div className="incidentReportText">{"22.817236"}</div>
          </div>
          <div className="flex-center">
            <div className="incidentReportText">Device ID:</div>
            <div className="incidentReportText">{"RzrIaAAqADe="}</div>
          </div>
          <div className="flex-center">
            <div className="incidentReportText">Device Name:</div>
            <div className="incidentReportText">{"ramp_meter_003"}</div>
          </div>
          <div className="flex-center">
            <div className="incidentReportText">Company name:</div>
            <div className="incidentReportText">{"MuseLabs Engineering"}</div>
          </div>
          <div className="flex-center">
            <div className="incidentReportText">Contact person:</div>
            <div className="incidentReportText">{"Chan Tai Man"}</div>
          </div>
          <div className="flex-center">
            <div className="incidentReportText">Phone number:</div>
            <div className="incidentReportText">{"9876-5432"}</div>
          </div>
          <div className="flex-center">
            <div className="incidentReportText">Car plate:</div>
            <div className="incidentReportText">{"EC8390"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentPage;
