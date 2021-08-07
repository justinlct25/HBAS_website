import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../css/Modal.css";
import { headers } from "../helpers/headers";
import { ModalType } from "../pages/ManageDevice";
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

type companyDetails = {
  id: number;
  companyName: string;
  tel: string;
  contactPerson: string | null;
  updatedAt: string;
  vehiclesCount: number;
};

type vehicleList = Array<{
  vehicleId: number;
  carPlate: string;
  vehicleModel: string;
  vehicleType: string;
  updatedAt: string;
  deviceId: number;
  deviceName: string;
  deviceEui: string;
}>;

interface deviceInfo {
  id: number;
  deviceName: string;
  deviceEui: string;
}

const { REACT_APP_API_SERVER, REACT_APP_API_VERSION } = process.env;

export const Modal = (props: ModalProps) => {
  const { isOpen, modalType, setSelectModalOpen } = props;
  const [focusNewDevice, setFocusNewDevice] = useState(true);
  const [searchField, setSearchField] = useState("");
  const [allDevices, setAllDevices] = useState<{
    linkedDevices: Array<deviceInfo>;
    notAssigned: Array<deviceInfo>;
  }>({ linkedDevices: [], notAssigned: [] });
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
            `${REACT_APP_API_SERVER}${REACT_APP_API_VERSION}/devices/link-device-vehicle`,
            {
              method: "GET",
              headers,
            }
          );
          if (res.status === 200) {
            const result = await res.json();
            const linkedDevices = await result.data.linkedDevices;
            const notAssigned = await result.data.newDevices;

            await setAllDevices({
              linkedDevices,
              notAssigned,
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
          // construct api url with (or without) search params
          const url = new URL(
            `${REACT_APP_API_VERSION}/companies`,
            `${REACT_APP_API_SERVER}`
          );
          url.searchParams.set("rows", "1000000"); // hardcoded rows to get all entries

          const res = await fetch(url.toString(), {
            method: "GET",
            headers,
          });
          if (res.status === 200) {
            const result = await res.json();
            setCompanyList(result.data);
          }
        } catch (e) {
          console.error(e.message);
        }
      };
      fetchAllCompanies();
    }
  }, [popUpIsActive, isOpen, modalType]);

  useEffect(() => {
    if (selectedItem.companyId === -1) return;
    const fetchVehiclesByCompanyId = async () => {
      try {
        const res = await fetch(
          `${REACT_APP_API_SERVER}${REACT_APP_API_VERSION}/vehicles/company-id/${selectedItem.companyId}`,
          {
            method: "GET",
            headers,
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
    fetchVehiclesByCompanyId();
  }, [selectedItem.companyId]);

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
                  Linked devices
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
                .filter((item) => item.deviceEui.includes(searchField))
                .map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="eachDevice"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        dispatch(
                          setSelectedItemAction({
                            deviceId: item.id,
                            deviceEui: item.deviceEui,
                          })
                        );
                        setSelectModalOpen({ isOpen: false, target: "device" });
                      }}
                    >
                      {item.deviceEui}
                    </div>
                  );
                })
            : allDevices?.linkedDevices
                .filter((item) => item.deviceEui.includes(searchField))
                .map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="eachDevice"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        dispatch(
                          setSelectedItemAction({
                            deviceId: item.id,
                            deviceEui: item.deviceEui,
                          })
                        );
                        setSelectModalOpen({ isOpen: false, target: "device" });
                      }}
                    >
                      {item.deviceEui}
                    </div>
                  );
                })
          : modalType === "carPlate"
          ? allVehicles.map((item) => {
              return (
                <div
                  className="eachDevice"
                  onClick={
                    selectedItem.companyName === ""
                      ? () => {}
                      : () => {
                          dispatch(
                            setSelectedItemAction({
                              vehicleId: item.vehicleId,
                              carPlate: item.carPlate,
                            })
                          );
                          setSelectModalOpen({
                            isOpen: false,
                            target: "carPlate",
                          });
                        }
                  }
                >
                  {item.carPlate}
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
                        companyName: item.companyName,
                        carPlate: "",
                      })
                    );
                    setSelectModalOpen({ isOpen: false, target: "company" });
                  }}
                >
                  {item.companyName}
                </div>
              );
            })}
      </div>
    </div>
  );
};
