import React from "react";
import { useDispatch } from "react-redux";
import { setAddNewFormOpenAction } from "../redux/addNewForm/action";
import {
  setPopUpIsActiveAction,
  setSelectedItemAction,
} from "../redux/assignDeviceModal/action";
import {
  setDeleteModalDataAction,
  setDeleteModalOpenAction,
} from "../redux/deleteModal/action";
import { IProfile } from "../redux/profile/state";
import { AssignIcon, DeleteIcon, EditIcon } from "./IconsOnly";

interface AnimatedVehicleCardProps {
  item: IProfile;
}

export const AnimatedVehicleCards = (props: AnimatedVehicleCardProps) => {
  const { item } = props;
  const dispatch = useDispatch();

  return (
    <div className="deviceVehicleCard">
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
      <div className="hiddenButtonContainer">
        <div
          className="hiddenButton flex-center"
          style={{ backgroundColor: "#8BB3FF" }}
          onClick={() => {
            dispatch(setPopUpIsActiveAction(true));
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
          <AssignIcon />
        </div>
        <div
          className="hiddenButton flex-center"
          style={{ backgroundColor: "#8BB3FF" }}
          onClick={() => {
            dispatch(setAddNewFormOpenAction(true));
            dispatch(
              setSelectedItemAction({
                carPlate: item.carPlate,
              })
            );
          }}
        >
          <EditIcon />
        </div>
        <div
          className="hiddenButton flex-center"
          style={{ backgroundColor: "#FF8989" }}
          onClick={() => {
            dispatch(setDeleteModalOpenAction(true));
            dispatch(
              setDeleteModalDataAction({
                vehicleId: item.vehicleId,
                carPlate: item.carPlate,
              })
            );
          }}
        >
          <DeleteIcon />
        </div>
      </div>
    </div>
  );
};
