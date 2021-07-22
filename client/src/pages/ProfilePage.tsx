import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { BackButton } from "../components/IconsOnly";
import userImage from "../images/userImage.png";
import { getProfileListThunk } from "../redux/profile/thunk";
import { IRootState } from "../redux/store";

interface comingData{
  id:number;
}

function ProfilePage() {
  const history = useHistory();
  const { state } = useLocation<comingData>();
  const profileList = useSelector((state: IRootState)=> state.profileList.profileList);
  const dispatch = useDispatch();

  useEffect(()=>{
    console.log(state);
    dispatch(getProfileListThunk(parseInt(String(state.id))));
  },[dispatch]);
  console.log(profileList);

  return (
    <div className="flex-center pageContainer">
      <div
        className="flex-center topRowContainer"
        style={{ justifyContent: "flex-start" }}
      >
        <div
          className="flex-center"
          style={{ cursor: "pointer" }}
          onClick={() => history.goBack()}
        >
          <div className="flex-center">
            <BackButton />
            <div style={{ margin: "8px", fontSize: "24px" }}>BACK</div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "24px 80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            height: "90%",
            width: "30%",
          }}
        >
          <img src={userImage} alt="userImage"/>
          <table>
            <tr>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <td>
                <div className="flex-center" style={{ marginTop: "16px" }}>
                  <div className="incidentReportText">Company name:</div>
                </div>
              </td>
              <td>
                <div className="flex-center" style={{ marginTop: "16px" }}>
                  <div className="incidentReportText">{profileList.length > 0 ? profileList[0].company_name : ''}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="flex-center" style={{ marginTop: "16px" }}>
                  <div className="incidentReportText">Contact person:</div>
                </div>
              </td>
              <td>
                <div className="flex-center" style={{ marginTop: "16px" }}>
                  <div className="incidentReportText">{profileList.length > 0 ? profileList[0].contact_person : ''}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="flex-center" style={{ marginTop: "16px" }}>
                  <div className="incidentReportText">Phone number:</div>
                </div>
              </td>
              <td>
                <div className="flex-center" style={{ marginTop: "16px" }}>
                  <div className="incidentReportText">{profileList.length > 0 ? profileList[0].tel : ''}</div>
                </div>
              </td>
            </tr>
          </table>
          {/* {<div className="flex-center" style={{ marginTop: "16px" }}>
            
            
          </div>
          <div className="flex-center">
            
            
          </div>
          <div className="flex-center">
            
            
          </div>} */}
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            margin: "0 8px",
          }}
        >
          <div className="flex-center">
            <div className="titleText">{"Devices & Vehicles"}</div>
          </div>
          {profileList.length > 0 ? profileList.map((item, idx)=>(
            <div>
              <div style={(item.device_eui === null)?{backgroundColor: '#F00'}:{backgroundColor: '#0F0'}}>{item.car_plate}</div>
            </div>
          )) : ''}
          <div className="flex-center">
            <div className="incidentReportText">Device ID:</div>
            <div className="incidentReportText">{"RzrIaAAqADe="}</div>
          </div>
          <div className="flex-center">
            <div className="incidentReportText">Device Name:</div>
            <div className="incidentReportText">{"ramp_meter_003"}</div>
          </div>

          <div className="flex-center">
            <div className="incidentReportText">Car plate:</div>
            <div className="incidentReportText">{"EC8390"}</div>
          </div>
          <div className="flex-center" style={{ marginTop: "40px" }}>
            <div className="titleText">View incident history</div>
            <div
              style={{
                transform: "rotate(180deg)",
              }}
            >
              <BackButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
