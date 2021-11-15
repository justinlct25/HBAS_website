import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMapboxGL, { Marker, Popup } from "react-mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { CaretIcon } from "../components/IconsOnly";
import Loading from "../components/Loading";
import { formatDate, formatTime } from "../helpers/date";
import { REACT_APP_API_SERVER, REACT_APP_API_VERSION } from "../helpers/processEnv";
import { IDataHistory, ILocationDetail } from "../models/resModels";
import { handleAxiosError } from "../redux/login/thunk";
import { IRootState } from "../redux/store";
import { io } from "socket.io-client";
import styles from "./TestMap.module.scss";

const BATTERY_MAX = 4.2;
const BATTERY_MIN = 3.6;
const localizationSelection = [
  {
    iso: "zh-Hant",
    innerHTML: "中",
  },
  {
    iso: "en",
    innerHTML: "Eng",
  },
];

const Map = ReactMapboxGL({
  accessToken: process.env.REACT_APP_MAPBOX_API_TOKEN!,
});

interface MapboxViewLocation {
  lng: number;
  lat: number;
  zoom: number;
}

const TestMap = () => {
  const [socket] = useState(io(REACT_APP_API_SERVER!));

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to socket.io!"));
  
    socket.on("new-data-type-A", async () => {
      const res = await axios.get<{ data: ILocationDetail[] }>(`/alert-data/latest-locations`);
      setIncidentPoints(res.data.data);
    });
  }, []);

  const temp = localStorage.getItem("mapboxLocation");
  const defaultMapboxLocation: MapboxViewLocation = {
    lng: 114.125,
    lat: 22.35,
    zoom: 10.2,
  };

  const [mapboxViewLocation, setMapboxViewLocation] = useState<MapboxViewLocation | null>(
    temp ? JSON.parse(temp) : defaultMapboxLocation
  );
  const [historyHoverIndex, setHistoryHoverIndex] = useState(-1);
  const [isReportOpen, setIsReportOpen] = useState(true);
  const dispatch = useDispatch();
  const [map, setMap] = useState<mapboxgl.Map>();
  const [incidentPoints, setIncidentPoints] = useState<ILocationDetail[]>([]);
  const [deviceData, setDeviceData] = useState<{ deviceName: string; carPlate: string }>({
    deviceName: "",
    carPlate: "",
  });
  const [viewHistory, setViewHistory] = useState<IDataHistory[] | null>(null);
  const [hoverAnimate, setHoverAnimate] = useState({ onHover: false, idx: -1 });
  const [localization, setLocalization] = useState(localizationSelection[0].iso);

  const isLoading = useSelector((state: IRootState) => state.loading.loading.isLoading);

  const onMapLoad = async (map: mapboxgl.Map) => {
    console.log(temp);
    setMap(map);

    map.getStyle().layers?.forEach((layer) => {
      if (layer.id.includes("-label")) {
        map.setLayoutProperty(layer.id, "text-field", ["get", `name_${localization}`]);
      }
    });

    try {
      // const res = await axios.get<{ data: ILocationDetail[] }>(`/alert-data`);
      const res = await axios.get<{ data: ILocationDetail[] }>(`/alert-data/latest-locations`);
      const result = res.data.data;
      setIncidentPoints(result);
    } catch (error) {
      dispatch(handleAxiosError(error));
    }
  };

  const batteryCalculation = (bat: string) => {
    const battery = parseFloat(bat);
    let percentage = ((battery - BATTERY_MIN) / (BATTERY_MAX - BATTERY_MIN)) * 100;
    if (percentage > 100) {
      percentage = 100;
    }
    if (percentage < 0) {
      percentage = 0;
    }
    return percentage;
  };

  useEffect(() => {
    map?.getStyle().layers?.forEach((layer) => {
      if (layer.id.endsWith("-label")) {
        map.setLayoutProperty(layer.id, "text-field", ["get", `name_${localization}`]);
      }
    });
  }, [map, localization]);

  useEffect(() => {
    if (!mapboxViewLocation || mapboxViewLocation.lat < -90 || mapboxViewLocation.lng < -90) return;
    localStorage.setItem("mapboxLocation", JSON.stringify(mapboxViewLocation));
  }, [
    mapboxViewLocation?.lat,
    mapboxViewLocation?.lng,
    mapboxViewLocation?.zoom,
    mapboxViewLocation,
  ]);

  //
  const fetchAllPreviousPulse = async (point: ILocationDetail) => {
    try {
      const url = new URL(
        `${REACT_APP_API_VERSION}/alert-data/history/${point.deviceId}`,
        REACT_APP_API_SERVER
      );
      url.searchParams.set("date", point.date.toString().substr(0, 10));
      const res = await axios.get<{ data: IDataHistory[] }>(url.toString());
      const result = res.data;
      const filtered = result.data.filter((i) => i.address !== "GPS NOT FOUND");
      const tempArr: IDataHistory[] = [];
      let mark = filtered[filtered.length - 1].date;
      for (let i = filtered.length - 1; i >= 0; i--) {
        if (new Date(filtered[i].date).valueOf() >= new Date(mark).valueOf() + 1000 * 60 * 60) {
          tempArr.push(filtered[i]);
          mark = filtered[i].date;
        }
      }
      setViewHistory(tempArr);
      setIsReportOpen(true);
    } catch (error) {
      dispatch(handleAxiosError(error));
    }
  };
  //

  return (
    <>
      <Map
        // eslint-disable-next-line react/style-prop-object
        style="mapbox://styles/shinji1129/ckr4cxoe30c9i17muitq9vqvo"
        // style="mapbox://styles/shinji1129/ckqyxuv0lcfmn18o9pgzhwgq4"
        // style="mapbox://styles/shinji1129/ckr4d9iy60ci317mte2mzob6k"
        zoom={mapboxViewLocation?.zoom ? [mapboxViewLocation?.zoom] : [10.2]}
        center={
          mapboxViewLocation?.lat && mapboxViewLocation?.lng
            ? [mapboxViewLocation.lng, mapboxViewLocation.lat]
            : [114.125, 22.35]
        }
        containerStyle={{
          height: "calc(100vh - var(--topNavHeight) - 32px)",
          width: "100vw",
          position: "absolute",
        }}
        onStyleLoad={(map) => onMapLoad(map)}
        onZoomEnd={(e) => {
          setMapboxViewLocation({
            lng: e.getCenter().lng,
            lat: e.getCenter().lat,
            zoom: e.getZoom(),
          });
        }}
        onDragEnd={(e) => {
          setMapboxViewLocation({
            lng: e.getCenter().lng,
            lat: e.getCenter().lat,
            zoom: e.getZoom(),
          });
        }}
      >
        <>
          {viewHistory
            ? viewHistory.map((point, idx) => {
                return (
                  <Marker
                    coordinates={[point.geolocation.y, point.geolocation.x]}
                    anchor="center"
                    style={{ zIndex: historyHoverIndex === idx ? 4 : 0 }}
                  >
                    <div
                      className="flex-center"
                      style={{
                        height: historyHoverIndex === idx ? "48px" : "24px",
                        width: historyHoverIndex === idx ? "48px" : "24px",
                        fontSize: historyHoverIndex === idx ? "20px" : "12px",
                        borderRadius: "50%",
                        background: historyHoverIndex === idx ? "#FF6666CC" : "#00F900CC",
                        pointerEvents: "none",
                        transition: "all 0.3s",
                      }}
                    >
                      {idx + 1}
                    </div>
                  </Marker>
                );
                // }
              })
            : incidentPoints.map((point, idx) => (
                <Marker
                  key={point.deviceId + idx}
                  onMouseEnter={() => setHoverAnimate({ onHover: true, idx })}
                  onMouseLeave={() => setHoverAnimate({ onHover: false, idx })}
                  coordinates={[point.geolocation.y, point.geolocation.x]}
                  anchor="center"
                  style={{ zIndex: historyHoverIndex === idx ? 4 : 0 }}
                  onClick={() => {
                    fetchAllPreviousPulse(point);
                    setDeviceData({ deviceName: point.deviceName, carPlate: point.carPlate });
                    setHoverAnimate({ idx: -1, onHover: false });
                  }}
                >
                  <div className={["flex-center", styles["incident-marker"], point.msgType === "A" ? styles.accident : ""].join(" ").trim()}/>
                </Marker>
              ))}
          <CSSTransition
            in={hoverAnimate.onHover}
            timeout={400}
            classNames="popup"
            mountOnEnter
            unmountOnExit
          >
            {incidentPoints[hoverAnimate.idx] ? (
              <Popup
                coordinates={[
                  incidentPoints[hoverAnimate.idx].geolocation.y,
                  incidentPoints[hoverAnimate.idx].geolocation.x,
                ]}
                anchor="bottom-right"
                className="popup"
              >
                <div className={`${styles.popUpContent}`}>
                  <div>
                    <div>Car Plate:</div>
                    <div>{incidentPoints[hoverAnimate.idx].carPlate ?? " - "}</div>
                  </div>
                  <div>
                    <div>Device Eui:</div>
                    <div>{incidentPoints[hoverAnimate.idx].deviceEui}</div>
                  </div>
                  <div>
                    <div>Device Name:</div>
                    <div>{incidentPoints[hoverAnimate.idx].deviceName ?? " - "}</div>
                  </div>
                  <div>
                    <div>Battery:</div>
                    <div>{incidentPoints[hoverAnimate.idx].battery + "v"}</div>
                  </div>
                  <div>
                    <div>Date:</div>
                    <div>
                      {new Date(incidentPoints[hoverAnimate.idx].date).toLocaleDateString("en-CA")}
                    </div>
                  </div>
                  <div>
                    <div>Time:</div>
                    <div>
                      {new Date(incidentPoints[hoverAnimate.idx].date).toLocaleTimeString("en-CA")}
                    </div>
                  </div>
                  <div>
                    <div>RSSI:</div>
                    <div>
                      {incidentPoints[hoverAnimate.idx].rssi === null
                        ? " - "
                        : incidentPoints[hoverAnimate.idx].rssi}
                    </div>
                  </div>
                  <div>
                    <div>SNR:</div>
                    <div>
                      {incidentPoints[hoverAnimate.idx].snr === null
                        ? " - "
                        : incidentPoints[hoverAnimate.idx].snr}
                    </div>
                  </div>
                </div>
              </Popup>
            ) : (
              <></>
            )}
          </CSSTransition>
        </>
      </Map>
      {viewHistory && (
        <div
          style={{
            justifyContent: "center",
            minWidth: isReportOpen ? "85vmin" : "40px",
            maxWidth: isReportOpen ? "628px" : "0px",
            transition: "all 0.4s",
          }}
          className={
            isReportOpen
              ? "flex-row-column-start caretButton"
              : "flex-row-column-start caretButton hiddenReport"
          }
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
              className="flex-row-start flex-column"
              style={{
                opacity: isReportOpen ? 1 : 0,
                transition: "all 0.4s 0.2s",
                overflowY: "auto",
                maxHeight: "90vh",
                transform: "translateY(40px)",
                paddingBottom: "80px",
              }}
            >
              {isReportOpen && (
                <>
                  <div
                    className="flex-center"
                    style={{ width: "100%", flexDirection: "column", marginBottom: "24px" }}
                  >
                    <div>{"Car plate : " + deviceData.carPlate ?? " - "}</div>
                    <div>{"Device Name : " + deviceData.deviceName ?? " - "}</div>
                  </div>
                  <table>
                    <thead>
                      <tr
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.5fr 2fr 1.5fr",
                          width: "100%",
                        }}
                      >
                        <th className="incidentReportText">Index</th>
                        <th className="incidentReportText">Date</th>
                        <th className="incidentReportText">Battery</th>
                      </tr>
                    </thead>
                    <tbody className="flex-column-center">
                      {viewHistory &&
                        viewHistory.map((item, idx) => (
                          <tr
                            key={item.id}
                            style={{
                              cursor: "default",
                              background: historyHoverIndex === idx ? "#888" : "transparent",
                              display: "grid",
                              gridTemplateColumns: "1.5fr 2fr 1.5fr",
                              width: "100%",
                            }}
                            onMouseEnter={() => setHistoryHoverIndex(idx)}
                            onClick={() => setHistoryHoverIndex(idx)}
                          >
                            <td className="incidentReportText">{idx + 1}</td>
                            <td className="incidentReportText">
                              {formatDate(item.date) + " " + formatTime(item.date)}
                            </td>
                            <td className="incidentReportText">{item.battery}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}
        </div>
      )}
      <ul id={styles.localization}>
        {viewHistory && (
          <li
            onClick={() => {
              setViewHistory(null);
              setHoverAnimate({ idx: -1, onHover: false });
            }}
          >
            BACK
          </li>
        )}
        {localizationSelection.map((i) => (
          // eslint-disable-next-line jsx-a11y/role-supports-aria-props
          <li
            key={i.iso}
            onClick={() => setLocalization(i.iso)}
            aria-selected={localization === i.iso}
          >
            {i.innerHTML}
          </li>
        ))}
      </ul>
    </>
  );
};

export default TestMap;
