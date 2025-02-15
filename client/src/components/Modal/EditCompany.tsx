import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/TablePage.css";
import { useRouter } from "../../helpers/useRouter";
import { ICompanyInfo } from "../../models/resModels";
import { resetAddNewFormAction } from "../../redux/addNewForm/action";
import { setSelectedItemAction } from "../../redux/assignDeviceModal/action";
import { handleAxiosError } from "../../redux/login/thunk";
import { IRootState } from "../../redux/store";
import { CloseIcon } from "../IconsOnly";

function EditCompany() {
  const router = useRouter();
  const dispatch = useDispatch();

  const selectedItem = useSelector(
    (state: IRootState) => state.assignDevice.assignDeviceModal.selectedItem
  );
  const addNewForm = useSelector(
    (state: IRootState) => state.addNewForm.addNewForm
  );
  const isOpen = addNewForm.isOpen;
  const modalType = addNewForm.modalType;

  useEffect(() => {
    const splitRoute = router.pathname.split("/");
    const companyId = splitRoute[splitRoute.length - 1];
    const fetchCompanyById = async () => {
      try {
        const res = await axios.get<{ data: ICompanyInfo }>(
          `/companies/${companyId}`
        );
        const result = res.data;
        dispatch(
          setSelectedItemAction({
            companyId: parseInt(companyId),
            companyName: result.data.companyName,
            contactPerson: result.data.contactPerson,
            tel: result.data.tel,
          })
        );
      } catch (error) {
        dispatch(handleAxiosError(error));
      }
    };
    fetchCompanyById();
  }, [dispatch, router.pathname]);

  const handleSubmit = async () => {
    try {
      await axios.put<{ message: string }>(
        `/companies/${selectedItem.companyId}`,
        {
          companyName: selectedItem.companyName,
          tel: selectedItem.tel,
          contactPerson: selectedItem.contactPerson,
        }
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
        isOpen && modalType === "editCompany"
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
                <div className="titleText">Edit Company</div>
              </div>

              <div
                style={{
                  width: "100%",
                  marginBottom: "24px",
                  position: "relative",
                }}
              >
                <div className="flex-center formRow">
                  <div className="formLeftColumn">Company name :</div>
                  <div className="formRightColumn">
                    <input
                      className="formInput"
                      value={selectedItem.companyName}
                      onChange={(e) => {
                        dispatch(
                          setSelectedItemAction({
                            companyName: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="flex-center formRow">
                  <div className="formLeftColumn">Contact person :</div>
                  <div className="formRightColumn">
                    <input
                      className="formInput"
                      value={selectedItem.contactPerson}
                      onChange={(e) => {
                        dispatch(
                          setSelectedItemAction({
                            contactPerson: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="flex-center formRow">
                  <div className="formLeftColumn">Phone number :</div>
                  <div className="formRightColumn">
                    <input
                      className="formInput"
                      value={selectedItem.tel}
                      onChange={(e) => {
                        dispatch(
                          setSelectedItemAction({
                            tel: e.target.value,
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

export default EditCompany;
