import React from "react";
import { useHistory } from "react-router-dom";
import { BackButton } from "../components/IconsOnly";
import userImage from "../images/userImage.png";

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
            width: "30%",
          }}
        >
          <img src={userImage} />
          <div className="flex-center" style={{ marginTop: "16px" }}>
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
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            margin: "0 8px",
          }}
        >
          <div className="flex-center">
            <div className="titleText">{"Devices & Vehicles"}</div>
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
            <div className="incidentReportText">Car plate:</div>
            <div className="incidentReportText">{"EC8390"}</div>
          </div>
          <div className="flex-center" style={{ marginTop: "40px" }}>
            <div className="titleText">View incident history</div>
            <div
              style={{
                transform: "rotate(180deg)",
              }}
            >
              <BackButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
