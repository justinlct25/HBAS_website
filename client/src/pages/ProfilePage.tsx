import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AssignDeviceByVehicleModal from "../components/AssignDeviceByVehicleModal";
import { BackButton } from "../components/IconsOnly";
import { toHexAndSplit } from "../helpers/eui_decoder";
import { useRouter } from "../helpers/useRouter";
import {
  setPopUpIsActiveAction,
  setSelectedItemAction,
} from "../redux/assignDeviceModal/action";
import { getProfileListThunk } from "../redux/profile/thunk";
import { IRootState } from "../redux/store";

function ProfilePage() {
  const router = useRouter();
  const history = useHistory();
  const profileList = useSelector(
    (state: IRootState) => state.profileList.profileList
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const splitRoute = router.pathname.split("/");
    const routeId = splitRoute[splitRoute.length - 1];
    dispatch(getProfileListThunk(parseInt(routeId)));
  }, [dispatch]);

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
                  {/* {profileList.length > 0 ? profileList[0].company_name : ""} */}
                  {"FIX COMPANY NAME!!!!!!!"}
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
                  {/* {profileList.length > 0 ? profileList[0].contact_person : ""} */}
                  {"FIX CONTACT PERSON!!!!!!!!"}
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
                  {/* {profileList.length > 0 ? profileList[0].tel : ""} */}
                  {"FIX TEL!!!!!!!!"}
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
                  <div
                    className="deviceVehicleCard"
                    key={idx}
                    onClick={() => {
                      dispatch(setPopUpIsActiveAction(true));
                      dispatch(
                        setSelectedItemAction({
                          companyName: "FIX item.company_name!!!!!!!!!",
                          carPlate: item.carPlate,
                          vehicleId: item.vehicleId,
                          deviceEui: item.deviceEui,
                          deviceId: item.deviceId,
                        })
                      );
                    }}
                  >
                    <div className="flex-center">
                      <div className="incidentReportText">Device ID:</div>
                      <div
                        className="incidentReportText"
                        style={{
                          color: !item.deviceEui ? "#AAA" : "#333",
                        }}
                      >
                        {item.deviceEui === null
                          ? "No device yet"
                          : toHexAndSplit(item.deviceEui)}
                      </div>
                    </div>
                    <div className="flex-center">
                      <div className="incidentReportText">Device Name:</div>
                      <div
                        className="incidentReportText deviceName"
                        style={{
                          color: !item.deviceName ? "#AAA" : "#333",
                        }}
                      >
                        {item.deviceName === null
                          ? "No device yet"
                          : item.deviceName}
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
                        {item.carPlate}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <AssignDeviceByVehicleModal />
      </div>
    </div>
  );
}

export default ProfilePage;
