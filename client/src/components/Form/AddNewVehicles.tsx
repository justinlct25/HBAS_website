import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddIcon, CloseIcon, MinusIcon } from "../../components/IconsOnly";
import "../../css/TablePage.css";
import { resetAddNewFormAction } from "../../redux/addNewForm/action";
import { handleAxiosError } from "../../redux/login/thunk";
import { IRootState } from "../../redux/store";

function AddNewVehicles() {
  const [totalVehicle, setTotalVehicle] = useState<
    Array<{
      carPlate: string;
      vehicleType: string;
      vehicleModel: string;
    }>
  >([
    {
      carPlate: "",
      vehicleType: "",
      vehicleModel: "",
    },
  ]);

  const dispatch = useDispatch();
  const addNewForm = useSelector((state: IRootState) => state.addNewForm.addNewForm);

  const isOpen = addNewForm.isOpen;
  const modalType = addNewForm.modalType;

  const selectedItem = useSelector(
    (state: IRootState) => state.assignDevice.assignDeviceModal.selectedItem
  );
  const companyId = selectedItem.companyId;

  const handleDeleteVehicle = (idx: number) => {
    const newArr = totalVehicle.slice();
    newArr.splice(idx, 1);
    setTotalVehicle(newArr);
  };
  const handleAddVehicle = () => {
    setTotalVehicle([{ carPlate: "", vehicleType: "", vehicleModel: "" }, ...totalVehicle]);
  };

  const handleReset = () => {
    setTotalVehicle([{ carPlate: "", vehicleType: "", vehicleModel: "" }]);
    dispatch(resetAddNewFormAction());
  };

  const handleSubmit = async () => {
    try {
      await axios.post<{ message: string; ids: number[] }>(`/vehicles/company-id/${companyId}`, {
        vehicles: totalVehicle,
      });
    } catch (error) {
      dispatch(handleAxiosError(error));
    } finally {
      handleReset();
    }
  };

  const handleEditContent = (target: string, idx: number, input: string) => {
    const newArr = totalVehicle.slice();
    newArr[idx] = {
      ...totalVehicle[idx],
      [target]: input,
    };
    setTotalVehicle(newArr);
  };

  const overLength = totalVehicle.some((i) => i.carPlate.length >= 8);

  return (
    <>
      <div
        className={
          isOpen && modalType === "addNewVehicle"
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
                  <div className="titleText">Vehicles</div>
                  <div
                    className="flex-center formAddIconContainer"
                    onClick={() => handleAddVehicle()}
                  >
                    <AddIcon />
                    <div style={{ marginLeft: "8px" }}>Add New Vehicle</div>
                  </div>
                </div>
                {totalVehicle.map((item, idx) => {
                  return (
                    <div
                      key={`vehicle-${idx}`}
                      style={{
                        width: "100%",
                        margin: "24px 0",
                        position: "relative",
                      }}
                    >
                      <h1>{totalVehicle.length - idx}</h1>
                      <div className="flex-center formRow">
                        <div className="formLeftColumn">Car Plate :</div>
                        <div className="formRightColumn">
                          <input
                            className="formInput"
                            value={totalVehicle[idx].carPlate}
                            onChange={(e) => {
                              handleEditContent("carPlate", idx, e.target.value);
                            }}
                          />
                          {totalVehicle[idx].carPlate.length >= 8 && (
                            <div className="overLengthWarning">
                              Car plate length should not exceed 8 characters
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-center formRow">
                        <div className="formLeftColumn">Vehicle Type :</div>
                        <div className="formRightColumn">
                          <input
                            className="formInput"
                            value={totalVehicle[idx].vehicleType}
                            onChange={(e) => {
                              handleEditContent("vehicleType", idx, e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-center formRow">
                        <div className="formLeftColumn">Vehicle Model :</div>
                        <div className="formRightColumn">
                          <input
                            className="formInput"
                            value={totalVehicle[idx].vehicleModel}
                            onChange={(e) => {
                              handleEditContent("vehicleModel", idx, e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "50%",
                          width: "10%",
                        }}
                        className="flex-center formAddIconContainer"
                        onClick={() => handleDeleteVehicle(idx)}
                      >
                        <MinusIcon />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex-center formButtonContainer">
              <div className="button" onClick={handleReset}>
                Cancel
              </div>
              <div
                className="button"
                onClick={overLength ? () => {} : handleSubmit}
                style={{ backgroundColor: overLength ? "#AAA" : "#555" }}
              >
                Confirm
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddNewVehicles;
