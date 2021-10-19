import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalModal } from "../../redux/global/action";
import { IRootState } from "../../redux/store";
import "../../css/GlobalModal.css";
import { logout } from "../../redux/login/thunk";

function GlobalModal() {
  const global = useSelector((state: IRootState) => state.global.global);
  const isOpen = global.isOpen;
  const content = global.content;
  const identifier = global.identifier;
  const dispatch = useDispatch();

  const handleConfirm = () => {
    if (identifier === "CONFIRM_LOGOUT") {
      dispatch(logout());
      dispatch(setGlobalModal({ isOpen: false }));
    }
  };

  return (
    <div className={`full-size flex-center ${isOpen ? "isOpenState" : "isClosedState"}`}>
      <section className="flex-column-start relative contentContainer">
        <div className="m-3 full-width">
          <div className="secondaryText" style={{ marginBottom: "1em" }}>
            {content}
          </div>
          <div className="my-1 full-width flex-row-around relative">
            <button
              className="buttonStyle w-40"
              onClick={() => {
                dispatch(setGlobalModal({ isOpen: false }));
              }}
            >
              CANCEL
            </button>
            {identifier && (
              <button className="buttonStyle w-40" onClick={handleConfirm}>
                CONFIRM
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default GlobalModal;
