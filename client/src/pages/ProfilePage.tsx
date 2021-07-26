import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { BackButton } from "../components/IconsOnly";
import { useRouter } from "../helpers/useRouter";
import userImage from "../images/userImage.png";
import { getProfileListThunk } from "../redux/profile/thunk";
import { IRootState } from "../redux/store";
import { companyDevices } from "./mockUpData";

interface comingData {
  id: number;
}

function ProfilePage() {
  const history = useHistory();
  const { state } = useLocation<comingData>();
  const profileList = useSelector(
    (state: IRootState) => state.profileList.profileList
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(state);
    dispatch(getProfileListThunk(parseInt(String(state.id)), true));
  }, [dispatch]);
  console.log(profileList);

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
          padding: "0 32px",
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
                  {profileList.length > 0 ? profileList[0].company_name : ""}
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
                  {profileList.length > 0 ? profileList[0].contact_person : ""}
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
                  {profileList.length > 0 ? profileList[0].tel : ""}
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
            {profileList.length > 0 &&
              profileList.map((item, idx) => {
                return (
                  <div className="deviceVehicleCard" key={idx}>
                    <div className="flex-center">
                      <div className="incidentReportText">Device ID:</div>
                      <div
                        className="incidentReportText"
                        style={{
                          color: item.device_eui === null ? "#AAA" : "#333",
                        }}
                      >
                        {item.device_eui === null
                          ? "No device yet"
                          : item.device_eui}
                      </div>
                    </div>
                    <div className="flex-center">
                      <div className="incidentReportText">Device Name:</div>
                      <div
                        className="incidentReportText deviceName"
                        style={{
                          color: item.device_name === null ? "#AAA" : "#333",
                        }}
                      >
                        {item.device_name === null
                          ? "No device yet"
                          : item.device_name}
                      </div>
                    </div>

                    <div className="flex-center">
                      <div className="incidentReportText">Car plate:</div>
                      <div
                        className="incidentReportText"
                        style={{
                          color: "#333",
                        }}
                      >
                        {item.car_plate}
                      </div>
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
