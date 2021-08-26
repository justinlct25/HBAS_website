import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/TablePage.css";
import { resetAddNewFormAction } from "../../redux/addNewForm/action";
import { setSelectedItemAction } from "../../redux/assignDeviceModal/action";
import { handleAxiosError } from "../../redux/login/thunk";
import { IRootState } from "../../redux/store";
import { CloseIcon } from "../IconsOnly";

function EditVehicle() {
  const dispatch = useDispatch();

  const selectedItem = useSelector(
    (state: IRootState) => state.assignDevice.assignDeviceModal.selectedItem
  );
  const addNewForm = useSelector((state: IRootState) => state.addNewForm.addNewForm);
  const isOpen = addNewForm.isOpen;
  const modalType = addNewForm.modalType;

  const handleSubmit = async () => {
    try {
      await axios.put<{ message: string }>(`/vehicles/${selectedItem.vehicleId}`, {
        carPlate: selectedItem.carPlate,
        vehicleModel: selectedItem.vehicleModel ?? "",
        vehicleType: selectedItem.vehicleType ?? "",
        manufacturer: selectedItem.manufacturer ?? "",
        manufactureYear: selectedItem.manufactureYear ?? "",
      });

      dispatch(
        setSelectedItemAction({
          carPlate: "",
          vehicleModel: "",
          vehicleType: "",
          manufacturer: "",
          manufactureYear: "",
        })
      );
    } catch (error) {
      dispatch(handleAxiosError(error));
    } finally {
      dispatch(resetAddNewFormAction());
    }
  };
  const handleReset = () => {
    dispatch(resetAddNewFormAction());
  };

  return (
    <div
      style={{ zIndex: 10 }}
      className={
        isOpen && modalType === "editVehicle"
          ? "flex-center popUpContainer popUp"
          : "flex-center popUpContainer"
      }
    >
      <div className="popUpContent flex-center">
        <div className="closeIconContainer" onClick={handleReset}>
          <CloseIcon color={"#555"} />
        </div>
        <div className="formScreen">
          <div className="flex-center form">
            <div className="flex-center vehicleSection">
              <div style={{ position: "relative", width: "100%" }}>
                <div className="titleText">Edit Vehicle</div>
              </div>

              <div
                style={{
                  width: "100%",
                  marginBottom: "24px",
                  position: "relative",
                }}
              >
                <div className="flex-center formRow">
                  <div className="formLeftColumn">Car Plate :</div>
                  <div className="formRightColumn">
                    <input
                      className="formInput"
                      value={selectedItem.carPlate}
                      onChange={(e) => {
                        dispatch(
                          setSelectedItemAction({
                            carPlate: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="flex-center formRow">
                  <div className="formLeftColumn">Manufacturer :</div>
                  <div className="formRightColumn">
                    <input
                      className="formInput"
                      value={selectedItem.manufacturer ?? ""}
                      onChange={(e) => {
                        dispatch(
                          setSelectedItemAction({
                            manufacturer: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="flex-center formRow">
                  <div className="formLeftColumn">Vehicle Model :</div>
                  <div className="formRightColumn">
                    <input
                      className="formInput"
                      value={selectedItem.vehicleModel ?? ""}
                      onChange={(e) => {
                        dispatch(
                          setSelectedItemAction({
                            vehicleModel: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="flex-center formRow">
                  <div className="formLeftColumn">Tonnes :</div>
                  <div className="formRightColumn">
                    <input
                      className="formInput"
                      value={selectedItem.vehicleType ?? ""}
                      onChange={(e) => {
                        dispatch(
                          setSelectedItemAction({
                            vehicleType: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="flex-center formRow">
                  <div className="formLeftColumn">Manufacture Year :</div>
                  <div className="formRightColumn">
                    <input
                      className="formInput"
                      value={selectedItem.manufactureYear ?? ""}
                      onChange={(e) => {
                        dispatch(
                          setSelectedItemAction({
                            manufactureYear: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-center formButtonContainer">
            <div className="button" onClick={handleReset}>
              Cancel
            </div>
            <div
              className="button"
              onClick={() => {
                handleSubmit();
              }}
            >
              Confirm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditVehicle;
