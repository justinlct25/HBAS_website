import { push } from "connected-react-router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AnimatedVehicleCards } from "../components/AnimatedVehicleCards";
import AssignDeviceByVehicleModal from "../components/AssignDeviceByVehicleModal";
import AddNewVehicles from "../components/Form/AddNewVehicles";
import { AddIcon, BackButton, EditIcon } from "../components/IconsOnly";
import { DeleteModal } from "../components/Modal/DeleteModal";
import EditCompany from "../components/Modal/EditCompany";
import EditVehicle from "../components/Modal/EditVehicle";
import { VehicleCards } from "../components/VehicleCards";
import { useRouter } from "../helpers/useRouter";
import { setAddNewFormOpenAction } from "../redux/addNewForm/action";
import { resetPopUpAction, setSelectedItemAction } from "../redux/assignDeviceModal/action";
import { setDeleteModalDataAction, setDeleteModalOpenAction } from "../redux/deleteModal/action";
import { getProfileListThunk } from "../redux/profile/thunk";
import { IRootState } from "../redux/store";

function ProfilePage() {
  const router = useRouter();
  const history = useHistory();
  const profileList = useSelector((state: IRootState) => state.profileList.profileList);
  const dispatch = useDispatch();
  const assignDeviceModal = useSelector(
    (state: IRootState) => state.assignDevice.assignDeviceModal
  );
  const selectedItem = assignDeviceModal.selectedItem;
  const popUpIsActive = assignDeviceModal.popUpIsActive;
  const addNewFormIsOpen = useSelector((state: IRootState) => state.addNewForm.addNewForm.isOpen);
  const deleteModalIsOpen = useSelector(
    (state: IRootState) => state.deleteModal.deleteModal.isOpen
  );

  useEffect(() => {
    const splitRoute = router.pathname.split("/");
    const routeId = splitRoute[splitRoute.length - 1];
    if (!!popUpIsActive || !!addNewFormIsOpen || !!deleteModalIsOpen) return;
    dispatch(getProfileListThunk(parseInt(routeId)));
  }, [dispatch, popUpIsActive, addNewFormIsOpen, deleteModalIsOpen, router.pathname]);

  const handleReset = () => {
    dispatch(resetPopUpAction());
    history.goBack();
  };

  return (
    <div className="flex-center pageContainer">
      <div className="flex-center topRowContainer" style={{ justifyContent: "space-between" }}>
        <div className="flex-center" style={{ cursor: "pointer" }} onClick={handleReset}>
          <div className="flex-center">
            <BackButton />
            <div style={{ margin: "8px", fontSize: "24px" }}>BACK</div>
          </div>
        </div>
        <div
          className="deleteCompanyButton"
          onClick={() => {
            dispatch(setDeleteModalOpenAction(true, "company"));
            dispatch(
              setDeleteModalDataAction({
                companyId: selectedItem.companyId,
                companyName: selectedItem.companyName,
              })
            );
          }}
        >
          Delete Company
        </div>
      </div>
      <div className="profilePageContainer">
        <div className="profileLeftColumn">
          <div className="flex-center" style={{ width: "100%" }}>
            <div className="titleText">Company Details</div>
            <div
              className="hiddenButton flex-center"
              style={{ backgroundColor: "#8BB3FF" }}
              onClick={() => {
                dispatch(setAddNewFormOpenAction(true, "editCompany"));
              }}
            >
              <EditIcon />
            </div>
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
                <div className="formLeftColumn incidentReportText" style={{ width: "180px" }}>
                  Company name:
                </div>
                <div className="formRightColumn incidentReportText" style={{ width: "unset" }}>
                  {selectedItem.companyName}
                </div>
              </div>
              <div className="flex-center">
                <div className="formLeftColumn incidentReportText" style={{ width: "180px" }}>
                  Contact person:
                </div>
                <div className="formRightColumn incidentReportText" style={{ width: "unset" }}>
                  {selectedItem.contactPerson}
                </div>
              </div>
              <div className="flex-center">
                <div className="formLeftColumn incidentReportText" style={{ width: "180px" }}>
                  Phone number:
                </div>
                <div className="formRightColumn incidentReportText" style={{ width: "unset" }}>
                  {selectedItem.tel}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-center" style={{ width: "100%", marginTop: "2vh" }}>
            <div className="titleText">Vehicle Logs</div>
          </div>
          <div className="flex-center vehicleCardContainer" style={{ width: "80%" }}>
            {profileList.length > 0 &&
              profileList
                .filter((i) => i.deviceId)
                .map((item, idx) => {
                  return (
                    <VehicleCards
                      key={`vehicle-${item.vehicleId}`}
                      item={item}
                      cursor={"pointer"}
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
            <div
              className="flex-center"
              style={{ height: "40px", width: "40px", cursor: "pointer" }}
              onClick={() => {
                dispatch(setAddNewFormOpenAction(true, "addNewVehicle"));
              }}
            >
              <AddIcon />
            </div>
          </div>

          <div
            style={{
              position: "relative",
              padding: "16px 32px 32px 32px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              overflowY: "scroll",
            }}
          >
            {profileList.length > 0 &&
              profileList.map((item, idx) => {
                return <AnimatedVehicleCards key={item.vehicleId + idx} item={item} />;
              })}
          </div>
        </div>
        <AssignDeviceByVehicleModal />
        <AddNewVehicles />
        <EditCompany />
        <EditVehicle />
        <DeleteModal />
      </div>
    </div>
  );
}

export default ProfilePage;
