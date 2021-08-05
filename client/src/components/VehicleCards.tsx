import React from "react";
import { IProfile } from "../redux/profile/state";

interface VehicleProps {
  item: IProfile;
  callFunction: () => void;
}

export const VehicleCards = (props: VehicleProps) => {
  const { item, callFunction } = props;

  return (
    <div className="deviceVehicleCard" onClick={callFunction}>
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
