import axios from "axios";
import { useEffect, useState } from "react";
import ReactMapboxGL, { Feature, Layer } from "react-mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BackButton, CaretIcon } from "../components/IconsOnly";
import "../css/TablePage.css";
import {
  REACT_APP_API_SERVER,
  REACT_APP_API_VERSION,
} from "../helpers/processEnv";
import { useRouter } from "../helpers/useRouter";
import { setIncidentPageData } from "../redux/incidentPage/action";
import { handleAxiosError } from "../redux/login/thunk";
import { IRootState } from "../redux/store";

const Map = ReactMapboxGL({
  accessToken: process.env.REACT_APP_MAPBOX_API_TOKEN!,
});

type locationHistoryType = {
  address: string;
  battery: string;
  date: string;
  deviceId: number;
  geolocation: { x: number; y: number };
  id: number;
  msgType: string;
};

function IncidentPage() {
  const router = useRouter();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLiveView, setIsLiveView] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(true);
  const [locationHistory, setLocationHistory] = useState([]);

  const [mapLoaded, setMapLoaded] = useState(false);

  const incidentPageData = useSelector(
    (state: IRootState) => state.incidentPage.incidentPage
  );

  useEffect(() => {
    const splitRoute = router.pathname.split("/");
    const incidentId = splitRoute[splitRoute.length - 1];

    const fetchIncident = async () => {
      try {
        const url = new URL(
          `${REACT_APP_API_VERSION}/alert-data`,
          REACT_APP_API_SERVER
        );
        url.searchParams.set("id", `${incidentId}`);
        const res = await axios.get(url.toString());
        const result = res.data.data[0];
        console.log(result);
        dispatch(
          setIncidentPageData({
            incidentId: result.id,
            vehicleId: result.vehicleId,
            deviceId: result.deviceId,
            deviceEui: result.deviceEui,
            date: result.date,
            longitude: result.geolocation.y,
            latitude: result.geolocation.x,
            deviceName: result.deviceName,
            companyName: result.companyName,
            contactPerson: result.companyContactPerson,
            phoneNumber: result.companyTel,
            carPlate: result.carPlate,
          })
        );
      } catch (error) {
        dispatch(handleAxiosError(error));
      }
    };
    fetchIncident();
  }, []);

  useEffect(() => {
    console.log(incidentPageData.date.substr(0, 10));
    const fetchAllPreviousPulse = async () => {
      try {
        const url = new URL(
          `${REACT_APP_API_VERSION}/alert-data/history/${incidentPageData.deviceId}`,
          REACT_APP_API_SERVER
        );
        url.searchParams.set("date", incidentPageData.date.substr(0, 10));
        const res = await axios.get(url.toString());
        const result = res.data;
        // const url = new URL(
        //   `${REACT_APP_API_VERSION}/alert-data/history/${incidentPageData.deviceId}`,
        //   REACT_APP_API_SERVER
        // );
        // const res = await axios.get(url.toString());
        // const result = res.data.data[0];
        setLocationHistory(
          result.map((i: locationHistoryType) => {
            return { date: i.date, geolocation: i.geolocation };
          })
        );
      } catch (error) {
        dispatch(handleAxiosError(error));
      }
    };
    fetchAllPreviousPulse();
  }, [incidentPageData.deviceId]);

  const data = useSelector(
    (state: IRootState) => state.incidentPage.incidentPage
  );

  const date = new Date(data.date);
  const dateString = date.toLocaleString("en-CA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const timeString = date.toTimeString().substr(0, 8);

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
      <div className="flex-center tableContainer">
        <div
          style={{
            position: "relative",
            height: "90%",
            width: "100%",
          }}
        >
          <div className="flex-center satelliteViewButtonContainer">
            <div
              className="flex-center satelliteButton"
              style={{
                borderRadius: "8px 0px 0px 8px",
                color: isLiveView ? "#EEE" : "#555",
                background: isLiveView ? "rgba(94, 147, 220, 0.76)" : "#FFF",
              }}
              onClick={() => setIsLiveView(true)}
            >
              {"Satellite View"}
            </div>
            <div
              className="flex-center satelliteButton"
              style={{
                borderRadius: "0px 8px 8px 0px",
                color: isLiveView ? "#555" : "#EEE",
                background: isLiveView ? "#FFF" : "rgba(94, 147, 220, 0.76)",
              }}
              onClick={() => setIsLiveView(false)}
            >
              {"Map View"}
            </div>
          </div>

          {/* Map here */}
          <Map
            // eslint-disable-next-line react/style-prop-object
            style={
              isLiveView
                ? "mapbox://styles/shinji1129/ckr4cxoe30c9i17muitq9vqvo"
                : "mapbox://styles/shinji1129/ckqyxuv0lcfmn18o9pgzhwgq4"
            }
            zoom={[14]}
            center={[data.longitude, data.latitude]}
            containerStyle={{ height: "100%", width: "100%" }}
            onStyleLoad={() => setMapLoaded(true)}
          >
            <Layer
              type="circle"
              paint={{ "circle-color": "#00F900", "circle-radius": 10 }}
            >
              {mapLoaded ? (
                <Feature coordinates={[data.longitude, data.latitude]} />
              ) : (
                <></>
              )}
            </Layer>
          </Map>
          <div
            className={
              isReportOpen
                ? "flex-center caretButton"
                : "flex-center caretButton hiddenReport"
            }
            style={{
              width: isReportOpen ? "480px" : "3%",
            }}
          >
            <div
              className="flex-center caretContainer"
              onClick={() => setIsReportOpen(!isReportOpen)}
            >
              <div
                style={{
                  transform: isReportOpen ? "rotate(270deg)" : "rotate(90deg)",
                  transition: "all 0.4s",
                }}
              >
                <CaretIcon />
              </div>
            </div>
            <div
              className="flex-center"
              style={{
                minWidth: "400px",
                flexDirection: "column",
                alignItems: "flex-start",
                opacity: isReportOpen ? 1 : 0,
                transition: "all 0.4s 0.2s",
              }}
            >
              {isReportOpen && (
                <>
                  <div className="flex-center">
                    <div className="incidentReportText">Date:</div>
                    <div className="incidentReportText">{dateString}</div>
                  </div>
                  <div className="flex-center">
                    <div className="incidentReportText">Time:</div>
                    <div className="incidentReportText">{timeString}</div>
                  </div>
                  <div className="flex-center">
                    <div className="incidentReportText">Longitude:</div>
                    <div className="incidentReportText">{data.longitude}</div>
                  </div>
                  <div className="flex-center">
                    <div className="incidentReportText">Latitude:</div>
                    <div className="incidentReportText">{data.latitude}</div>
                  </div>
                  <div className="flex-center">
                    <div className="incidentReportText">Device ID:</div>
                    <div className="incidentReportText">{data.deviceEui}</div>
                  </div>
                  <div className="flex-center">
                    <div className="incidentReportText">Device Name:</div>
                    <div className="incidentReportText">{data.deviceName}</div>
                  </div>
                  <div className="flex-center">
                    <div className="incidentReportText">Company name:</div>
                    <div className="incidentReportText">{data.companyName}</div>
                  </div>
                  <div className="flex-center">
                    <div className="incidentReportText">Contact person:</div>
                    <div className="incidentReportText">
                      {data.contactPerson}
                    </div>
                  </div>
                  <div className="flex-center">
                    <div className="incidentReportText">Phone number:</div>
                    <div className="incidentReportText">{data.phoneNumber}</div>
                  </div>
                  <div className="flex-center">
                    <div className="incidentReportText">Car plate:</div>
                    <div className="incidentReportText">{data.carPlate}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentPage;
