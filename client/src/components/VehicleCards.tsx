import { push } from "connected-react-router";
import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedItemAction } from "../redux/assignDeviceModal/action";
import { IProfile } from "../redux/profile/state";

interface VehicleProps {
  item: IProfile;
}

export const VehicleCards = (props: VehicleProps) => {
  const { item } = props;
  const dispatch = useDispatch();

  return (
    <div
      className="deviceVehicleCard"
      onClick={() => {
        dispatch(push(`/vehicle-logs/${item.deviceId}`));
        dispatch(
          setSelectedItemAction({
            carPlate: item.carPlate,
            vehicleId: item.vehicleId,
            deviceEui: item.deviceEui,
            deviceId: item.deviceId,
          })
        );
      }}
    >
      <div className="flex-center">
        <div className="incidentReportText">Device ID:</div>
        <div
          className="incidentReportText"
          style={{
            color: !item.deviceEui ? "#AAA" : "#333",
          }}
        >
          {item.deviceEui === null ? "No device yet" : item.deviceEui}
        </div>
      </div>
      <div className="flex-center">
        <div className="incidentReportText">Device Name:</div>
        <div
          className="incidentReportText deviceName"
          style={{
            color: !item.deviceName ? "#AAA" : "#333",
          }}
        >
          {item.deviceName === null ? "No device yet" : item.deviceName}
        </div>
      </div>

      <div className="flex-center">
        <div className="incidentReportText">Car plate:</div>
        <div
          className="incidentReportText"
          style={{
            color: "#333",
          }}
        >
          {item.carPlate}
        </div>
      </div>
    </div>
  );
};
