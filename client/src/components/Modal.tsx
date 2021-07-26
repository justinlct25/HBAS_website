import { useDispatch, useSelector } from "react-redux";
import { ModalType } from "../pages/ManageDevice";
import { mockNewDevices } from "../pages/mockUpData";
import { setSelectedItemAction } from "../redux/assignDeviceModal/action";
import { IRootState } from "../redux/store";

interface ModalProps {
  isOpen: boolean;
  modalType: ModalType;
  setSelectModalOpen: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      target: ModalType;
    }>
  >;
}

export const Modal = (props: ModalProps) => {
  const { isOpen, modalType, setSelectModalOpen } = props;

  const dispatch = useDispatch();
  const selectedItem = useSelector(
    (state: IRootState) => state.assignDevice.assignDeviceModal.selectedItem
  );

  const headerText =
    modalType === "device"
      ? "New device"
      : modalType === "carPlate"
      ? "Car plate"
      : modalType === "company" && "Select company";

  return (
    <div
      className="selectDeviceModal"
      style={{
        right: isOpen ? 0 : "-100%",
      }}
    >
      <div className="titleText flex-center" style={{ margin: "16px" }}>
        <div className="selectDeviceHeader">{headerText}</div>
      </div>
      <div className="deviceListContainer">
        {modalType === "device"
          ? mockNewDevices.map((item) => {
              return (
                <div
                  className="eachDevice"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    dispatch(setSelectedItemAction({ deviceId: item }));
                    setSelectModalOpen({ isOpen: false, target: "device" });
                  }}
                >
                  {item}
                </div>
              );
            })
          : modalType === "carPlate"
          ? mockNewDevices.map((item) => {
              return (
                <div
                  className="eachDevice"
                  onClick={
                    selectedItem.companyName === ""
                      ? () => {}
                      : () => {
                          dispatch(setSelectedItemAction({ carPlate: item }));
                          setSelectModalOpen({
                            isOpen: false,
                            target: "carPlate",
                          });
                        }
                  }
                >
                  {item}
                </div>
              );
            })
          : modalType === "company" &&
            mockNewDevices.map((item) => {
              return (
                <div
                  className="eachDevice"
                  onClick={() => {
                    dispatch(setSelectedItemAction({ companyName: item }));
                    setSelectModalOpen({ isOpen: false, target: "company" });
                  }}
                >
                  {item}
                </div>
              );
            })}
      </div>
    </div>
  );
};
