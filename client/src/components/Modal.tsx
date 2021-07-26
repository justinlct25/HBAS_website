import { ModalType } from "../pages/ManageDevice";
import { mockNewDevices } from "../pages/mockUpData";

interface ModalProps {
  isOpen: boolean;
  modalType: ModalType;
  selectedItem: {
    companyName: string;
    deviceId: string;
    carPlate: string;
  };
  setSelectedItem: React.Dispatch<
    React.SetStateAction<{
      companyName: string;
      deviceId: string;
      carPlate: string;
    }>
  >;
}

export const Modal = (props: ModalProps) => {
  const { isOpen, modalType, setSelectedItem, selectedItem } = props;
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
                  onClick={
                    selectedItem.carPlate === ""
                      ? () => {}
                      : () => {
                          setSelectedItem({
                            companyName: selectedItem.companyName,
                            deviceId: item,
                            carPlate: selectedItem.carPlate,
                          });
                        }
                  }
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
                          setSelectedItem({
                            companyName: selectedItem.companyName,
                            deviceId: "",
                            carPlate: item,
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
                    setSelectedItem({
                      companyName: item,
                      deviceId: "",
                      carPlate: "",
                    });
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
