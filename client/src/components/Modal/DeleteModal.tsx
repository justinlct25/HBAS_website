import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetDeleteModalAction,
  setDeleteModalOpenAction,
} from "../../redux/deleteModal/action";
import { IRootState } from "../../redux/store";
import "../../css/Modal.css";
import { headers } from "../../helpers/headers";
import { setPopUpIsActiveAction } from "../../redux/assignDeviceModal/action";
import { push } from "connected-react-router";

const { REACT_APP_API_SERVER, REACT_APP_API_VERSION } = process.env;

export const DeleteModal = () => {
  const dispatch = useDispatch();
  const deleteModal = useSelector(
    (state: IRootState) => state.deleteModal.deleteModal
  );

  const handleSubmit = async () => {
    if (deleteModal.deleteType === "vehicle") {
      try {
        await fetch(
          `${REACT_APP_API_SERVER}${REACT_APP_API_VERSION}/vehicles/${deleteModal.vehicleId}`,
          {
            method: "DELETE",
            headers,
          }
        );
      } catch (e) {
        console.error(e.message);
      } finally {
        dispatch(setDeleteModalOpenAction(false, ""));
      }
    }
    if (deleteModal.deleteType === "company") {
      try {
        await fetch(
          `${REACT_APP_API_SERVER}${REACT_APP_API_VERSION}/companies/${deleteModal.companyId}`,
          {
            method: "DELETE",
            headers,
          }
        );
      } catch (e) {
        console.error(e.message);
      } finally {
        dispatch(resetDeleteModalAction());
        dispatch(push("/manage-user"));
      }
    }
  };
  return (
    <div
      className="flex-center deleteModalContainer"
      style={{
        top: deleteModal.isOpen ? "0px" : "-100%",
      }}
    >
      <div className="flex-center deleteModal">
        {deleteModal.deleteType === "vehicle" && (
          <div>{`Remove Vehicle ${deleteModal.carPlate} ?`}</div>
        )}
        {deleteModal.deleteType === "company" && (
          <div>{`Delete company ${deleteModal.companyName} ?`}</div>
        )}
        <div className="flex-center formButtonContainer">
          <div
            className="button"
            style={{ transform: "scale(0.8)" }}
            onClick={() => dispatch(resetDeleteModalAction())}
          >
            Cancel
          </div>
          <div
            className="button"
            style={{ transform: "scale(0.8)" }}
            onClick={handleSubmit}
          >
            Confirm
          </div>
        </div>
      </div>
    </div>
  );
};
