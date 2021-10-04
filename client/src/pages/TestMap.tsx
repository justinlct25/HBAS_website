import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMapboxGL, { Feature, Layer, Marker, Popup } from "react-mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { IDataHistory, ILocationDetail } from "../models/resModels";
import { handleAxiosError } from "../redux/login/thunk";
import styles from "./TestMap.module.scss";
import { CaretIcon } from "../components/IconsOnly";
import Loading from "../components/Loading";
import { REACT_APP_API_VERSION, REACT_APP_API_SERVER } from "../helpers/processEnv";
import { setIsLoadingAction } from "../redux/loading/action";
import { IRootState } from "../redux/store";
import { formatDate, formatTime } from "../helpers/date";

const defaultZoom: [number] = [10.2];
const defaultCenter: [number, number] = [114.125, 22.35];
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

const TestMap = () => {
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
    setMap(map);

    map.getStyle().layers?.forEach((layer) => {
      if (layer.id.includes("-label")) {
        map.setLayoutProperty(layer.id, "text-field", ["get", `name_${localization}`]);
      }
    });

    try {
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
      setViewHistory(result.data.filter((i) => i.address !== "GPS NOT FOUND"));
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
        // style="mapbox://styles/shinji1129/ckqyxuv0lcfmn18o9pgzhwgq4"
        // style="mapbox://styles/shinji1129/ckr4d9iy60ci317mte2mzob6k"
        style="mapbox://styles/shinji1129/ckr4cxoe30c9i17muitq9vqvo"
        zoom={defaultZoom}
        center={defaultCenter}
        containerStyle={{
          height: "calc(100vh - var(--topNavHeight) - 32px)",
          width: "100vw",
          position: "absolute",
        }}
        onStyleLoad={(map) => onMapLoad(map)}
      >
        <>
          {viewHistory ? (
            viewHistory.map((point, idx) => (
              <Marker
                coordinates={[point.geolocation.y, point.geolocation.x]}
                anchor="center"
                style={{ zIndex: historyHoverIndex === idx ? 4 : 0 }}
              >
                <div
                  className="flex-center"
                  style={{
                    height: historyHoverIndex === idx ? "32px" : "16px",
                    width: historyHoverIndex === idx ? "32px" : "16px",
                    borderRadius: "50%",
                    background: historyHoverIndex === idx ? "#FF6666CC" : "#00F900",
                    pointerEvents: "none",
                    transition: "all 0.3s",
                  }}
                >
                  {idx + 1}
                </div>
              </Marker>
            ))
          ) : (
            <Layer type="circle" paint={{ "circle-color": "#00F900", "circle-radius": 10 }}>
              {incidentPoints.map((point, idx) => (
                <Feature
                  key={point.deviceId + idx}
                  coordinates={[point.geolocation.y, point.geolocation.x]}
                  onMouseEnter={() => setHoverAnimate({ onHover: true, idx })}
                  onMouseLeave={() => setHoverAnimate({ onHover: false, idx })}
                  // onClick={() => setViewHistory(point)}
                  onClick={() => fetchAllPreviousPulse(point)}
                />
              ))}
            </Layer>
          )}
          <Layer type="circle" paint={{ "circle-color": "#00F900", "circle-radius": 10 }}>
            {viewHistory
              ? viewHistory.map((point, idx) => (
                  <Feature
                    key={point.deviceId + idx}
                    coordinates={[point.geolocation.y, point.geolocation.x]}
                    onMouseEnter={() => setHoverAnimate({ onHover: true, idx })}
                    onMouseLeave={() => setHoverAnimate({ onHover: false, idx })}
                    // onClick={() => setViewHistory(point)}
                  >
                    {idx}
                  </Feature>
                ))
              : incidentPoints.map((point, idx) => (
                  <Feature
                    key={point.deviceId + idx}
                    coordinates={[point.geolocation.y, point.geolocation.x]}
                    onMouseEnter={() => setHoverAnimate({ onHover: true, idx })}
                    onMouseLeave={() => setHoverAnimate({ onHover: false, idx })}
                    // onClick={() => setViewHistory(point)}
                    onClick={() => {
                      fetchAllPreviousPulse(point);
                      setDeviceData({ deviceName: point.deviceName, carPlate: point.carPlate });
                    }}
                  />
                ))}
          </Layer>
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
                    <div>{incidentPoints[hoverAnimate.idx].carPlate}</div>
                  </div>
                  <div>
                    <div>Device Eui:</div>
                    <div>{incidentPoints[hoverAnimate.idx].deviceEui}</div>
                  </div>
                  <div>
                    <div>Device Name:</div>
                    <div>{incidentPoints[hoverAnimate.idx].deviceName}</div>
                  </div>
                  <div>
                    <div>Battery:</div>
                    <div>{incidentPoints[hoverAnimate.idx].battery + "v"}</div>
                    {/* <div>
                    {batteryCalculation(incidentPoints[hoverAnimate.idx].battery).toFixed(2) + "%"}
                  </div> */}
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
          style={{ zIndex: 5 }}
          className={
            isReportOpen ? "flex-center caretButton" : "flex-center caretButton hiddenReport"
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
              className="flex-center"
              style={{
                minWidth: "600px",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                opacity: isReportOpen ? 1 : 0,
                transition: "all 0.4s 0.2s",
                overflowY: "auto",
                maxHeight: "80vh",
                transform: "translateY(40px)",
              }}
            >
              {isReportOpen && (
                <>
                  <div
                    className="flex-center"
                    style={{ width: "100%", flexDirection: "column", marginBottom: "24px" }}
                  >
                    <div>{"Car plate :" + deviceData.carPlate}</div>
                    <div>{"Device Name :" + deviceData.deviceName}</div>
                  </div>
                  <table style={{ minWidth: "500px", width: "100%" }}>
                    <thead>
                      <tr
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr 1fr",
                          width: "100%",
                        }}
                      >
                        <th className="incidentReportText">Index</th>
                        <th className="incidentReportText">Date</th>
                        <th className="incidentReportText">Battery</th>
                        <th className="incidentReportText">Message Type</th>
                      </tr>
                    </thead>
                    <tbody className="flex-center" style={{ flexDirection: "column" }}>
                      {viewHistory &&
                        viewHistory.map((item, idx) => (
                          <tr
                            key={item.id}
                            style={{
                              cursor: "default",
                              background: historyHoverIndex === idx ? "#888" : "transparent",
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr 1fr",
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
                            <td className="incidentReportText">{item.msgType}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {/* <div className="flex-center">
                  <div className="incidentReportText">Latitude:</div>
                  <div className="incidentReportText">
                    { data.latitude}
                  </div>
                </div>
                <div className="flex-center">
                  <div className="incidentReportText">Longitude:</div>
                  <div className="incidentReportText">
                    { data.longitude}
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
                </div> */}
                </>
              )}
            </div>
          )}
        </div>
      )}
      <ul id={styles.localization}>
        {viewHistory && <li onClick={() => setViewHistory(null)}>BACK</li>}
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
