import { push } from "connected-react-router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AddNewForm from "../components/AddNewForm";
import { AnimatedVehicleCards } from "../components/AnimatedVehicleCards";
import AssignDeviceByVehicleModal from "../components/AssignDeviceByVehicleModal";
import EditVehicle from "../components/Modal/EditVehicle";
import { AddIcon, BackButton, EditIcon } from "../components/IconsOnly";
import { DeleteModal } from "../components/Modal/DeleteModal";
import { VehicleCards } from "../components/VehicleCards";
import { useRouter } from "../helpers/useRouter";
import { setAddNewFormOpenAction } from "../redux/addNewForm/action";
import {
  resetPopUpAction,
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
  const selectedItem = useSelector(
    (state: IRootState) => state.assignDevice.assignDeviceModal.selectedItem
  );

  useEffect(() => {
    const splitRoute = router.pathname.split("/");
    const routeId = splitRoute[splitRoute.length - 1];
    dispatch(getProfileListThunk(parseInt(routeId)));
  }, [dispatch]);

  const handleReset = () => {
    dispatch(resetPopUpAction());
    history.goBack();
  };

  return (
    <div className="flex-center pageContainer">
      <div
        className="flex-center topRowContainer"
        style={{ justifyContent: "space-between" }}
      >
        <div
          className="flex-center"
          style={{ cursor: "pointer" }}
          onClick={handleReset}
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
          <div className="flex-center">
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
                  {selectedItem.companyName}
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
                  {selectedItem.contactPerson}
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
                  {selectedItem.tel}
                </div>
              </div>
            </div>
          </div>
          <div
            className="flex-center"
            style={{ width: "100%", marginTop: "2vh" }}
          >
            <div className="titleText">Vehicle Logs</div>
          </div>
          <div className="flex-center vehicleCardContainer">
            {profileList.length > 0 &&
              profileList
                .filter((i) => i.deviceId)
                .map((item, idx) => {
                  return (
                    <VehicleCards
                      key={idx}
                      item={item}
                      callFunction={() => {
                        dispatch(push(`/vehicle-logs/${item.deviceId}`));
                        dispatch(
                          setSelectedItemAction({
                            carPlate: item.carPlate,
                            vehicleId: item.vehicleId,
                            deviceEui: item.deviceEui,
                            deviceId: item.deviceId,
                          })
                        );
                      }}
                    />
                  );
                })}
          </div>
        </div>
        <div className="flex-center companyDetailsRightColumn">
          <div className="flex-center">
            <div className="titleText">{"Devices & Vehicles"}</div>
          </div>

          <div
            style={{
              position: "relative",
              paddingBottom: "16px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            {profileList.length > 0 &&
              profileList.map((item, idx) => {
                return (
                  <>
                    <AnimatedVehicleCards key={idx} item={item} />
                  </>
                );
              })}
          </div>
        </div>
        <AssignDeviceByVehicleModal />
        {/* <AddNewForm /> */}
        <EditVehicle />
        <DeleteModal />
      </div>
    </div>
  );
}

export default ProfilePage;
