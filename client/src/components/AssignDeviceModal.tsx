import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ModalType } from "../pages/ManageDevice";
import { resetPopUpAction } from "../redux/assignDeviceModal/action";
import { IRootState } from "../redux/store";
import { BackButton, CloseIcon } from "./IconsOnly";
import { Modal } from "./Modal";
import "../css/Modal.css";
import { useEffect } from "react";

function AssignDeviceModal() {
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

  const handleReset = () => {
    setSelectModalOpen({ isOpen: false, target: "company" });
    dispatch(resetPopUpAction());
  };

  const handleSubmit = () => {
    const assignDevice = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_SERVER}/vehicle_device`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              vehicleID: assignDeviceModal.selectedItem.vehicleId,
              deviceID: assignDeviceModal.deviceId,
            }),
          }
        );
        if (res.status === 201 || res.status === 200) {
          const data = await res.json();
        }
      } catch (e) {
        console.error(e.message);
      }
    };
    assignDevice();

    dispatch(resetPopUpAction());
  };

  return (
    <div
      className={
        popUpIsActive
          ? "flex-center popUpContainer popUp"
          : "flex-center popUpContainer"
      }
    >
      <div className="popUpContent flex-center">
        <div className="closeIconContainer" onClick={handleReset}>
          <CloseIcon color={"#555"} />
        </div>
        <div className="flex-center modalContainer">
          <div className="flex-center form">
            <div className="flex-center companySection">
              <div className="titleText">Assign device</div>
              <div className="flex-center formRow">
                <div className="formLeftColumn">Device ID :</div>
                <div
                  className="flex-center deviceId"
                  style={{
                    width: "30%",
                    justifyContent: "flex-start",
                  }}
                >
                  <div className="flex-center deviceId">
                    {selectedItem.deviceEui}
                  </div>
                </div>
              </div>
              <div className="flex-center formRow">
                <div className="formLeftColumn">Company name :</div>
                <div
                  className="flex-center"
                  style={{
                    width: "30%",
                    justifyContent: "flex-start",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectModalOpen({ isOpen: true, target: "company" });
                  }}
                >
                  <div>
                    {selectedItem.companyName === ""
                      ? "Select Company"
                      : selectedItem.companyName}
                  </div>
                  <div
                    style={{
                      transform: "rotate(180deg)",
                      paddingRight: "8px",
                    }}
                  >
                    <BackButton />
                  </div>
                </div>
              </div>
              <div className="flex-center formRow">
                <div className="formLeftColumn">Car Plate :</div>
                <div
                  className="flex-center"
                  style={{
                    width: "30%",
                    justifyContent: "flex-start",
                    cursor: "pointer",
                  }}
                  onClick={
                    selectedItem.companyName === ""
                      ? () => {}
                      : () =>
                          setSelectModalOpen({
                            isOpen: true,
                            target: "carPlate",
                          })
                  }
                >
                  <div
                    style={{
                      color: selectedItem.companyName === "" ? "#AAA" : "#555",
                      transition: "all 0.4s",
                    }}
                  >
                    {selectedItem.carPlate === ""
                      ? "Select car plate"
                      : selectedItem.carPlate}
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
            <div className="button" onClick={handleReset}>
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

export default AssignDeviceModal;
