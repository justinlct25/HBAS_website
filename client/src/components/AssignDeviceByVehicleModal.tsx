import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../css/Modal.css";
import { headers } from "../helpers/headers";
import { ModalType } from "../pages/ManageDevice";
import { setPopUpIsActiveAction } from "../redux/assignDeviceModal/action";
import { IRootState } from "../redux/store";
import { BackButton, CloseIcon } from "./IconsOnly";
import { Modal } from "./Modal";
import axios from "axios";

function AssignDeviceByVehicleModal() {
  const [selectModalOpen, setSelectModalOpen] = useState<{
    isOpen: boolean;
    target: ModalType;
  }>({ isOpen: false, target: "company" });

  const dispatch = useDispatch();
  const assignDeviceModal = useSelector(
    (state: IRootState) => state.assignDevice.assignDeviceModal
  );
  const popUpIsActive = assignDeviceModal.popUpIsActive;
  const selectedItem = assignDeviceModal.selectedItem;

  const closeAction = () => {
    setSelectModalOpen({ isOpen: false, target: "company" });
    dispatch(setPopUpIsActiveAction(false));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`/devices/link-device-vehicle`, {
        deviceId: assignDeviceModal.deviceId,
        vehicleId: assignDeviceModal.selectedItem.vehicleId,
      });
    } catch (e) {
      console.error(e.message);
    } finally {
      dispatch(setPopUpIsActiveAction(false));
    }
  };

  return (
    <div
      style={{ zIndex: 10 }}
      className={
        popUpIsActive
          ? "flex-center popUpContainer popUp"
          : "flex-center popUpContainer"
      }
    >
      <div className="popUpContent flex-center">
        <div className="closeIconContainer" onClick={closeAction}>
          <CloseIcon color={"#555"} />
        </div>
        <div className="flex-center modalContainer">
          <div className="flex-center form">
            <div className="flex-center companySection">
              <div className="titleText">Assign device by vehicle</div>
              <div className="flex-center formRow">
                <div className="formLeftColumn">Company name :</div>
                <div className="flex-center notSelectable">
                  <div>
                    {selectedItem.companyName === ""
                      ? "Select Company"
                      : selectedItem.companyName}
                  </div>
                </div>
              </div>
              <div className="flex-center formRow">
                <div className="formLeftColumn">Car Plate :</div>
                <div className="flex-center notSelectable">
                  <div>
                    {selectedItem.carPlate === ""
                      ? "Select car plate"
                      : selectedItem.carPlate}
                  </div>
                </div>
              </div>
              <div className="flex-center formRow">
                <div className="formLeftColumn">Device ID :</div>
                <div
                  className="flex-center notSelectable"
                  style={{
                    width: "30%",
                    justifyContent: "flex-start",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setSelectModalOpen({ isOpen: true, target: "device" })
                  }
                >
                  <div
                    className="flex-center deviceId"
                    style={{
                      cursor: "pointer",
                      color: "#555",
                    }}
                  >
                    {selectedItem.deviceEui === ""
                      ? "Select device"
                      : selectedItem.deviceEui}
                  </div>
                  <div
                    style={{
                      transform: "rotate(180deg)",
                      paddingRight: "8px",
                    }}
                  >
                    <BackButton
                      color={selectedItem.companyName === "" ? "#AAA" : "#555"}
                    />
                  </div>
                </div>
              </div>
            </div>
            {selectModalOpen.isOpen && (
              <div
                className="clickElsewhere"
                onClick={() =>
                  setSelectModalOpen({
                    isOpen: false,
                    target: selectModalOpen.target,
                  })
                }
              />
            )}
            <Modal
              isOpen={selectModalOpen.isOpen}
              modalType={selectModalOpen.target}
              setSelectModalOpen={setSelectModalOpen}
            />
          </div>
          <div className="flex-center formButtonContainer">
            <div className="button" onClick={closeAction}>
              Cancel
            </div>
            <div className="button" onClick={handleSubmit}>
              Confirm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignDeviceByVehicleModal;
