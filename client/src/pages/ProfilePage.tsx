import React from "react";
import { useHistory } from "react-router-dom";
import { BackButton } from "../components/IconsOnly";
import { companyDevices } from "./mockUpData";

function ProfilePage() {
  const history = useHistory();
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
        className="flex-center"
        style={{
          width: "100%",
          maxHeight: "80%",
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "50%" }}>
          <div className="flex-center" style={{ width: "100%" }}>
            <div className="titleText">Company Details</div>
          </div>
          <div
            className="flex-center"
            style={{
              width: "100%",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="flex-center">
                <div
                  className="formLeftColumn incidentReportText"
                  style={{ width: "180px" }}
                >
                  Company name:
                </div>
                <div
                  className="formRightColumn incidentReportText"
                  style={{ width: "unset" }}
                >
                  MuseLabs Engineering
                </div>
              </div>
              <div className="flex-center">
                <div
                  className="formLeftColumn incidentReportText"
                  style={{ width: "180px" }}
                >
                  Contact person:
                </div>
                <div
                  className="formRightColumn incidentReportText"
                  style={{ width: "unset" }}
                >
                  Chan Tai Man
                </div>
              </div>
              <div className="flex-center">
                <div
                  className="formLeftColumn incidentReportText"
                  style={{ width: "180px" }}
                >
                  Phone number:
                </div>
                <div
                  className="formRightColumn incidentReportText"
                  style={{ width: "unset" }}
                >
                  {"9876-5432"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-center companyDetailsRightColumn">
          <div className="flex-center">
            <div className="titleText">{"Devices & Vehicles"}</div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            {companyDevices.map((item, idx) => {
              return (
                <div className="deviceVehicleCard" key={idx}>
                  <div className="flex-center">
                    <div className="incidentReportText">Device ID:</div>
                    <div className="incidentReportText">{item.deviceId}</div>
                  </div>
                  <div className="flex-center">
                    <div className="incidentReportText">Device Name:</div>
                    <div className="incidentReportText deviceName">
                      {item.deviceName}
                    </div>
                  </div>

                  <div className="flex-center">
                    <div className="incidentReportText">Car plate:</div>
                    <div className="incidentReportText">{item.carPlate}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
