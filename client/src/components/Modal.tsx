import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ModalType } from "../pages/ManageDevice";
import { mockNewDevices } from "../pages/mockUpData";
import { setSelectedItemAction } from "../redux/assignDeviceModal/action";
import { IRootState } from "../redux/store";
import "../css/Modal.css";

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

type fetchedData = {
  data: Array<{
    id: number;
    device_name: string;
    device_eui: string;
    is_register: boolean;
  }>;
};

export const Modal = (props: ModalProps) => {
  const { isOpen, modalType, setSelectModalOpen } = props;
  const [focusNewDevice, setFocusNewDevice] = useState(true);
  const [searchField, setSearchField] = useState("");
  const [allDevices, setAllDevices] = useState<{
    allDevices: Array<{
      device_eui: string;
      device_name: string;
      id: number;
      is_register: boolean;
    }>;
    notAssigned: Array<{
      device_eui: string;
      device_name: string;
      id: number;
      is_register: boolean;
    }>;
  }>();

  const dispatch = useDispatch();
  const selectedItem = useSelector(
    (state: IRootState) => state.assignDevice.assignDeviceModal.selectedItem
  );

  const headerText =
    modalType === "carPlate"
      ? "Car plate"
      : modalType === "company" && "Select company";

  useEffect(() => {
    const fetchAllDevices = async () => {
      try {
        const res = await fetch(`http://localhost:8085/allDevices`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        if (res.status === 201 || res.status === 200) {
          const data: fetchedData = await res.json();
          const allDevices = data.data.slice();
          const notAssigned = data.data.filter((dt) => !dt.is_register);
          console.log(data);
          setAllDevices({
            allDevices: allDevices,
            notAssigned: notAssigned,
          });
        }
      } catch (e) {
        console.error(e.message);
      }
    };
    fetchAllDevices();
  }, []);

  return (
    <div
      className="selectDeviceModal"
      style={{
        right: isOpen ? 0 : "-100%",
      }}
    >
      <div className="titleText flex-center" style={{ margin: "16px" }}>
        {modalType !== "device" ? (
          <div className="selectDeviceHeader">{headerText}</div>
        ) : (
          <>
            <div
              className="flex-center"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="modalToggleContainer flex-center">
                <div
                  className="toggle"
                  style={{
                    borderRadius: "5px 0px 0px 5px",
                    background: focusNewDevice ? "#FFF" : "#222",
                  }}
                  onClick={() => setFocusNewDevice(true)}
                >
                  New devices
                </div>
                <div
                  className="toggle"
                  style={{
                    borderRadius: "0px 5px 5px 0px",
                    background: !focusNewDevice ? "#FFF" : "#222",
                  }}
                  onClick={() => setFocusNewDevice(false)}
                >
                  All devices
                </div>
              </div>
              <input
                className="modalInput"
                placeholder={"Search..."}
                value={searchField}
                onChange={(e) => {
                  setSearchField(e.target.value);
                }}
              />
            </div>
          </>
        )}
      </div>
      <div className="deviceListContainer">
        {modalType === "device"
          ? focusNewDevice
            ? allDevices?.notAssigned
                .filter((item) => item.device_eui.includes(searchField))
                .map((item) => {
                  return (
                    <div
                      className="eachDevice"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        dispatch(
                          setSelectedItemAction({ deviceId: item.device_eui })
                        );
                        setSelectModalOpen({ isOpen: false, target: "device" });
                      }}
                    >
                      {item.device_eui}
                    </div>
                  );
                })
            : allDevices?.allDevices
                .filter((item) => item.device_eui.includes(searchField))
                .map((item) => {
                  return (
                    <div
                      className="eachDevice"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        dispatch(
                          setSelectedItemAction({ deviceId: item.device_eui })
                        );
                        setSelectModalOpen({ isOpen: false, target: "device" });
                      }}
                    >
                      {item.device_eui}
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
