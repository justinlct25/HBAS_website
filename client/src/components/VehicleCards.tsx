import React from "react";
import { IProfile } from "../redux/profile/state";

interface VehicleProps {
  item: IProfile;
  callFunction: () => void;
  cursor?: string;
}

export const VehicleCards = (props: VehicleProps) => {
  const { item, callFunction, cursor = "default" } = props;

  return (
    <div className="deviceVehicleCard" onClick={callFunction} style={{ cursor }}>
      <h4>{item.carPlate}</h4>
      <div className="flex-center">
        <div className="incidentReportText" style={{ color: "#888" }}>
          Device ID:
        </div>
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
        <div className="incidentReportText" style={{ color: "#888" }}>
          Device Name:
        </div>
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
        <div className="incidentReportText" style={{ color: "#888" }}>
          Car plate:
        </div>
        <div
          className="incidentReportText"
          style={{
            color: "#333",
          }}
        >
          {item.carPlate ?? " - "}
        </div>
      </div>
    </div>
  );
};
