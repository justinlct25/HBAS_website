import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ModalType } from "../pages/ManageDevice";
import { mockNewDevices } from "../pages/mockUpData";
import {
  setDeviceIdAction,
  setSelectedItemAction,
} from "../redux/assignDeviceModal/action";
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
type deviceDetails = {
  id: number;
  device_name: string;
  device_eui: string;
  is_register: boolean;
};

type fetchedData = {
  data: Array<deviceDetails>;
};

type companyDetails = {
  company_name: string;
  contact_person: string;
  count: string;
  id: number;
  tel: string;
  updated_at: string;
};

type vehicleList = Array<{
  car_plate: string;
  company_id: number;
  company_name: string;
  device_eui: string;
  device_id: number;
  is_register: true;
  vehicle_id: number;
}>;

const { REACT_APP_API_SERVER } = process.env;

export const Modal = (props: ModalProps) => {
  const { isOpen, modalType, setSelectModalOpen } = props;
  const [focusNewDevice, setFocusNewDevice] = useState(true);
  const [searchField, setSearchField] = useState("");
  const [allDevices, setAllDevices] = useState<{
    allDevices: Array<deviceDetails>;
    notAssigned: Array<deviceDetails>;
  }>();
  const [companyList, setCompanyList] = useState<Array<companyDetails>>();
  const [allVehicles, setAllVehicles] = useState<vehicleList>([]);

  const dispatch = useDispatch();
  const assignDeviceModal = useSelector(
    (state: IRootState) => state.assignDevice.assignDeviceModal
  );

  const selectedItem = assignDeviceModal.selectedItem;
  const popUpIsActive = assignDeviceModal.popUpIsActive;

  const headerText =
    modalType === "carPlate"
      ? "Car plate"
      : modalType === "company" && "Select company";

  useEffect(() => {
    if (modalType === "device") {
      const fetchAllDevices = async () => {
        try {
          const res = await fetch(
            `${REACT_APP_API_SERVER}/allDevices`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
            }
          );
          if (res.status === 201 || res.status === 200) {
            const data: fetchedData = await res.json();
            const allDevices = await data.data.slice();
            const notAssigned = await data.data.filter((dt) => !dt.is_register);
            await setAllDevices({
              allDevices: allDevices,
              notAssigned: notAssigned,
            });
          }
        } catch (e) {
          console.error(e.message);
        }
      };
      fetchAllDevices();
    } else {
      const fetchAllCompanies = async () => {
        try {
          const res = await fetch(
            `${REACT_APP_API_SERVER}/companies`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
            }
          );
          if (res.status === 201 || res.status === 200) {
            const result = await res.json();
            setCompanyList(result.companies);
          }
        } catch (e) {
          console.error(e.message);
        }
      };
      fetchAllCompanies();
    }
    const fetchAllVehicles = async () => {
      try {
        const res = await fetch(
          `${REACT_APP_API_SERVER}/allCompanies`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
        if (res.status === 201 || res.status === 200) {
          const result = await res.json();
          setAllVehicles(result.data);
        }
      } catch (e) {
        console.error(e.message);
      }
    };
    fetchAllVehicles();
  }, [popUpIsActive, isOpen, modalType]);

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
                      key={item.id}
                      className="eachDevice"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        dispatch(setDeviceIdAction(item.id, item.device_eui));
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
                      key={item.id}
                      className="eachDevice"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        dispatch(setDeviceIdAction(item.id, item.device_eui));
                        setSelectModalOpen({ isOpen: false, target: "device" });
                      }}
                    >
                      {item.device_eui}
                    </div>
                  );
                })
          : modalType === "carPlate"
          ? allVehicles
              .filter((i) => i.company_id === selectedItem.companyId)
              .map((item) => {
                return (
                  <div
                    className="eachDevice"
                    onClick={
                      selectedItem.companyName === ""
                        ? () => {}
                        : () => {
                            dispatch(
                              setSelectedItemAction({
                                vehicleId: item.vehicle_id,
                                carPlate: item.car_plate,
                              })
                            );
                            setSelectModalOpen({
                              isOpen: false,
                              target: "carPlate",
                            });
                          }
                    }
                  >
                    {item.car_plate}
                  </div>
                );
              })
          : modalType === "company" &&
            companyList &&
            companyList.map((item) => {
              return (
                <div
                  key={item.id}
                  className="eachDevice"
                  onClick={() => {
                    dispatch(
                      setSelectedItemAction({
                        companyId: item.id,
                        companyName: item.company_name,
                        carPlate: "",
                      })
                    );
                    setSelectModalOpen({ isOpen: false, target: "company" });
                  }}
                >
                  {item.company_name}
                </div>
              );
            })}
      </div>
    </div>
  );
};
