import axios from "axios";
import { push } from "connected-react-router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/Modal.css";
import {
  resetDeleteModalAction,
  setDeleteModalOpenAction,
} from "../../redux/deleteModal/action";
import { handleAxiosError } from "../../redux/login/thunk";
import { IRootState } from "../../redux/store";

export const DeleteModal = () => {
  const dispatch = useDispatch();
  const deleteModal = useSelector(
    (state: IRootState) => state.deleteModal.deleteModal
  );

  const handleSubmit = async () => {
    if (deleteModal.deleteType === "vehicle") {
      try {
        await axios.delete<{ message: string }>(
          `/vehicles/${deleteModal.vehicleId}`
        );
      } catch (error) {
        dispatch(handleAxiosError(error));
      } finally {
        dispatch(setDeleteModalOpenAction(false, ""));
      }
    }
    if (deleteModal.deleteType === "company") {
      try {
        await axios.delete<{ message: string }>(
          `/companies/${deleteModal.companyId}`
        );
      } catch (error) {
        dispatch(handleAxiosError(error));
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
