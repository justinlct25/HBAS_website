import axios from "axios";
import { useEffect, useState } from "react";
import ReactMapboxGL, { Marker } from "react-mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BackButton, CaretIcon } from "../components/IconsOnly";
import Loading from "../components/Loading";
import "../css/TablePage.css";
import { REACT_APP_API_SERVER, REACT_APP_API_VERSION } from "../helpers/processEnv";
import { useRouter } from "../helpers/useRouter";
import { IAlertData, IDataHistory, IPagination } from "../models/resModels";
import { setGeolocation, setIncidentPageData } from "../redux/incidentPage/action";
import { setIsLoadingAction } from "../redux/loading/action";
import { handleAxiosError } from "../redux/login/thunk";
import { IRootState } from "../redux/store";

const Map = ReactMapboxGL({
  accessToken: process.env.REACT_APP_MAPBOX_API_TOKEN!,
});

function IncidentPage() {
  const router = useRouter();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLiveView, setIsLiveView] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(true);
  const [locationHistory, setLocationHistory] = useState<
    {
      date: string;
      geolocation: {
        x: number;
        y: number;
      };
    }[]
  >([]);

  const incidentPageData = useSelector((state: IRootState) => state.incidentPage.incidentPage);
  const isGPSNotFound = useSelector((state: IRootState) => state.incidentPage.isGPSNotFound);

  const isLoading = useSelector((state: IRootState) => state.loading.loading.isLoading);

  useEffect(() => {
    dispatch(setIsLoadingAction(true));
    const splitRoute = router.pathname.split("/");
    const incidentId = splitRoute[splitRoute.length - 1];

    const fetchIncident = async () => {
      try {
        const url = new URL(`${REACT_APP_API_VERSION}/alert-data`, REACT_APP_API_SERVER);
        url.searchParams.set("id", `${incidentId}`);
        const res = await axios.get<{
          data: IAlertData[];
          pagination: IPagination;
        }>(url.toString());
        const result = res.data.data[0];
        dispatch(
          setIncidentPageData({
            incidentId: result.id,
            vehicleId: result.vehicleId,
            deviceId: result.deviceId,
            deviceEui: result.deviceEui,
            date: result.date,
            longitude: isGPSNotFound ? incidentPageData.longitude : result.geolocation.y,
            latitude: isGPSNotFound ? incidentPageData.latitude : result.geolocation.x,
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
  }, [dispatch]);

  useEffect(() => {
    if (incidentPageData.deviceId === -1) return;
    const fetchAllPreviousPulse = async () => {
      try {
        const url = new URL(
          `${REACT_APP_API_VERSION}/alert-data/history/${incidentPageData.deviceId}`,
          REACT_APP_API_SERVER
        );
        url.searchParams.set("date", new Date(incidentPageData.date).toISOString());
        const res = await axios.get<{ data: IDataHistory[] }>(url.toString());
        const result = res.data.data;
        setLocationHistory(
          result
            .filter((i) => i.geolocation.y > 0 && i.geolocation.x > 0)
            .map((i) => ({ date: i.date, geolocation: i.geolocation }))
        );
      } catch (error) {
        dispatch(handleAxiosError(error));
      } finally {
        dispatch(setIsLoadingAction(false));
      }
    };
    fetchAllPreviousPulse();
  }, [incidentPageData.deviceId, dispatch]);

  useEffect(() => {
    if (isGPSNotFound && locationHistory.length) {
      dispatch(
        setGeolocation({
          longitude: locationHistory[0].geolocation.y,
          latitude: locationHistory[0].geolocation.x,
        })
      );
    }
  }, [locationHistory, dispatch]);

  const data = useSelector((state: IRootState) => state.incidentPage.incidentPage);

  const [currentMapView, setCurrentMapView] = useState({
    center: [data.longitude, data.latitude] as [number, number],
    zoom: [14] as [number],
  });

  useEffect(() => {
    setCurrentMapView({
      center: [data.longitude, data.latitude],
      zoom: [14],
    });
  }, [data]);

  const date = new Date(data.date);
  const dateString = date.toLocaleString("en-CA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const timeString = date.toTimeString().substr(0, 8);

  return (
    <div className="flex-center pageContainer">
      <div className="flex-center topRowContainer" style={{ justifyContent: "flex-start" }}>
        <div className="flex-center full-width" style={{ flexWrap: "wrap" }}>
          <div className="flex-row-start pointer flex1" onClick={() => history.goBack()}>
            <BackButton />
            <div style={{ margin: "8px", fontSize: "min(4vmin, 24px)" }}>BACK</div>
          </div>
          <div className="my-2 flex-center flex1 satelliteViewButtonContainer">
            <div
              className="flex-center satelliteButton"
              style={{
                position: "relative",
                borderRadius: "8px 0px 0px 8px",
                color: isLiveView ? "#EEE" : "#555",
                background: isLiveView ? "rgba(94, 147, 220, 0.76)" : "#FFF",
              }}
              onClick={() => setIsLiveView(true)}
            >
              Satellite View
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
              Map View
            </div>
          </div>
          <div className="flex1" />
        </div>
      </div>
      <div className="flex-center tableContainer" style={{ padding: "24px 0" }}>
        <div
          style={{
            position: "relative",
            height: "90%",
            width: "100%",
          }}
        >
          {/* <div className="flex-center satelliteViewButtonContainer">
            <div
              className="flex-center satelliteButton"
              style={{
                borderRadius: "8px 0px 0px 8px",
                color: isLiveView ? "#EEE" : "#555",
                background: isLiveView ? "rgba(94, 147, 220, 0.76)" : "#FFF",
              }}
              onClick={() => setIsLiveView(true)}
            >
              Satellite View
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
              Map View
            </div>
          </div> */}

          {/* Map here */}
          <Map
            // eslint-disable-next-line react/style-prop-object
            style={
              isLiveView
                ? "mapbox://styles/shinji1129/ckr4cxoe30c9i17muitq9vqvo"
                : "mapbox://styles/shinji1129/ckqyxuv0lcfmn18o9pgzhwgq4"
            }
            center={currentMapView.center}
            zoom={currentMapView.zoom}
            containerStyle={{ height: "100%", width: "100%" }}
            onDrag={(e) =>
              setCurrentMapView({
                center: e.getCenter().toArray() as [number, number],
                zoom: [e.getZoom()],
              })
            }
            onZoom={(e) =>
              setCurrentMapView({
                center: e.getCenter().toArray() as [number, number],
                zoom: [e.getZoom()],
              })
            }
          >
            {isGPSNotFound ? (
              locationHistory.map((item, idx) => (
                <Marker coordinates={[item.geolocation.y, item.geolocation.x]} anchor="center">
                  <div
                    style={{
                      height: "16px",
                      width: "16px",
                      borderRadius: "50%",
                      background: "#00F900",
                      pointerEvents: "none",
                    }}
                  >
                    {idx}
                  </div>
                </Marker>
              ))
            ) : (
              <Marker coordinates={[data.longitude, data.latitude]} anchor="center">
                <div
                  style={{
                    height: "24px",
                    width: "24px",
                    borderRadius: "50%",
                    background: "#FF4545",
                    pointerEvents: "none",
                  }}
                />
              </Marker>
            )}
          </Map>
          <div
            className={
              isReportOpen ? "flex-center caretButton" : "flex-center caretButton hiddenReport"
            }
            style={{
              width: isReportOpen ? "56vmin" : "3%",
              top: 0,
              height: "100%",
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
            {isLoading ? (
              <Loading />
            ) : (
              <div
                className="flex-center"
                style={{
                  // minWidth: "400px",
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
                      <div className="incidentReportText">Latitude:</div>
                      <div className="incidentReportText">
                        {isGPSNotFound ? "Not found" : data.latitude}
                      </div>
                    </div>
                    <div className="flex-center">
                      <div className="incidentReportText">Longitude:</div>
                      <div className="incidentReportText">
                        {isGPSNotFound ? "Not found" : data.longitude}
                      </div>
                    </div>
                    <div className="flex-center">
                      <div className="incidentReportText">Device EUI:</div>
                      <div className="incidentReportText">{data.deviceEui}</div>
                    </div>
                    <div className="flex-center">
                      <div className="incidentReportText">Device Name:</div>
                      <div className="incidentReportText">{data.deviceName}</div>
                    </div>
                    <div className="flex-center">
                      <div className="incidentReportText">Company name:</div>
                      <div className="incidentReportText">{data.companyName || "-"}</div>
                    </div>
                    <div className="flex-center">
                      <div className="incidentReportText">Contact person:</div>
                      <div className="incidentReportText">{data.contactPerson || "-"}</div>
                    </div>
                    <div className="flex-center">
                      <div className="incidentReportText">Phone number:</div>
                      <div className="incidentReportText">{data.phoneNumber || "-"}</div>
                    </div>
                    <div className="flex-center">
                      <div className="incidentReportText">Car plate:</div>
                      <div className="incidentReportText">{data.carPlate || "-"}</div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentPage;
