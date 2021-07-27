import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ModalType } from "../pages/ManageDevice";
import { resetPopUpAction } from "../redux/assignDeviceModal/action";
import { IRootState } from "../redux/store";
import { BackButton, CloseIcon } from "./IconsOnly";
import { Modal } from "./Modal";
import "../css/Modal.css";

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

  const handleReset = () => {
    setSelectModalOpen({ isOpen: false, target: "company" });
    dispatch(resetPopUpAction());
  };
  const handleSubmit = () => {
    //POST API here
    // use assignDeviceModal.deviceId
    // use selectedItem.companyId for POST API
    //API: "http://localhost:8085/allDevices",

    //  const deleteInRoutesPool = () => {
    //
    //     try {
    //       const token = localStorage.getItem("token");
    //       const res = await fetch(
    //         `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_API_VERSION}/admin/routes-pool`,
    //         {
    //           method: "DELETE",
    //           headers: {
    //             Authorization: "Bearer " + token,
    //             "Content-type": "application/json; charset=utf-8",
    //           },
    //           body: JSON.stringify({ routeId }),
    //         }
    //       );
    //       const result = await res.json();
    //       if (res.status === httpStatusCodes.OK) {
    //         alert(result.message);
    //       } else {
    //         dispatch(handleFetchErrors(res.status, result.message));
    //       }
    //     } catch (e) {
    //       console.error(e.message);
    //     }
    // };

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
                    {selectedItem.deviceId === ""
                      ? "Select device"
                      : selectedItem.deviceId}
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

export default AssignDeviceByVehicleModal;
