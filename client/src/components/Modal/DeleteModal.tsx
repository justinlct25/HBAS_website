import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetDeleteModalAction,
  setDeleteModalOpenAction,
} from "../../redux/deleteModal/action";
import { IRootState } from "../../redux/store";
import "../../css/Modal.css";

export const DeleteModal = () => {
  const dispatch = useDispatch();
  const deleteModal = useSelector(
    (state: IRootState) => state.deleteModal.deleteModal
  );
  return (
    <div
      className="flex-center deleteModalContainer"
      style={{
        top: deleteModal.isOpen ? "0px" : "-100%",
      }}
    >
      <div className="flex-center deleteModal">
        <div>{`Remove Vehicle ${deleteModal.carPlate} ?`}</div>
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
            onClick={() => {
              dispatch(setDeleteModalOpenAction(false));
            }}
          >
            Confirm
          </div>
        </div>
      </div>
    </div>
  );
};
