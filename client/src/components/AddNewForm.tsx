import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddIcon, CloseIcon, MinusIcon } from "../components/IconsOnly";
import "../css/TablePage.css";
import { inputCompanyDetailsAction, resetAddNewFormAction } from "../redux/addNewForm/action";
import { postCompaniesDataThunk } from "../redux/companies/thunk";
import { IRootState } from "../redux/store";

function AddNewForm() {
  const [totalVehicle, setTotalVehicle] = useState<
    Array<{
      carPlate: string;
      vehicleType: string;
      vehicleModel: string;
    }>
  >([]);

  const dispatch = useDispatch();
  const addNewForm = useSelector((state: IRootState) => state.addNewForm.addNewForm);

  const isOpen = addNewForm.isOpen;
  const modalType = addNewForm.modalType;

  const handleDeleteVehicle = (idx: number) => {
    const newArr = totalVehicle.slice();
    newArr.splice(idx, 1);
    setTotalVehicle(newArr);
  };
  const handleAddVehicle = () => {
    setTotalVehicle([{ carPlate: "", vehicleType: "", vehicleModel: "" }, ...totalVehicle]);
  };

  const handleReset = () => {
    setTotalVehicle([]);
    dispatch(resetAddNewFormAction());
  };

  return (
    <>
      <div
        className={
          isOpen && modalType === "addNew"
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
              <div className="flex-center companySection">
                <div className="titleText">Company Details</div>
                <div className="flex-center formRow">
                  <div className="formLeftColumn">Company Name :</div>
                  <div className="formRightColumn">
                    <input
                      className="formInput"
                      value={addNewForm.companyName}
                      onChange={(e) => {
                        dispatch(
                          inputCompanyDetailsAction({
                            companyName: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="flex-center formRow">
                  <div className="formLeftColumn">Contact Person :</div>
                  <div className="formRightColumn">
                    <input
                      className="formInput"
                      value={addNewForm.contactPerson}
                      onChange={(e) => {
                        dispatch(
                          inputCompanyDetailsAction({
                            contactPerson: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="flex-center formRow">
                  <div className="formLeftColumn">Phone Number :</div>
                  <div className="formRightColumn">
                    <input
                      className="formInput"
                      value={addNewForm.tel}
                      onChange={(e) => {
                        dispatch(
                          inputCompanyDetailsAction({
                            tel: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-center vehicleSection">
                <div style={{ position: "relative", width: "100%" }}>
                  <div className="titleText">Vehicles</div>
                  <div
                    className="flex-center formAddIconContainer"
                    onClick={() => handleAddVehicle()}
                  >
                    <AddIcon />
                    <div className="pointer" style={{ marginLeft: "8px" }}>
                      Add New Vehicle
                    </div>
                  </div>
                </div>
                {totalVehicle.map((item, idx) => {
                  return (
                    <div
                      key={`vehicle-idx-${idx}`}
                      style={{
                        width: "100%",
                        marginBottom: "24px",
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
                              const newArr = totalVehicle.slice();
                              newArr[idx] = {
                                ...totalVehicle[idx],
                                carPlate: e.target.value,
                              };
                              setTotalVehicle(newArr);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-center formRow">
                        <div className="formLeftColumn">Vehicle Type :</div>
                        <div className="formRightColumn">
                          <input
                            className="formInput"
                            value={totalVehicle[idx].vehicleType}
                            onChange={(e) => {
                              const newArr = totalVehicle.slice();
                              newArr[idx] = {
                                ...totalVehicle[idx],
                                vehicleType: e.target.value,
                              };
                              setTotalVehicle(newArr);
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
                              const newArr = totalVehicle.slice();
                              newArr[idx] = {
                                ...totalVehicle[idx],
                                vehicleModel: e.target.value,
                              };
                              setTotalVehicle(newArr);
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
                onClick={() => {
                  dispatch(
                    postCompaniesDataThunk(totalVehicle, {
                      companyName: addNewForm.companyName,
                      contactPerson: addNewForm.contactPerson,
                      tel: addNewForm.tel,
                    })
                  );
                  handleReset();
                }}
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

export default AddNewForm;
