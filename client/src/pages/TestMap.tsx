import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMapboxGL, { Feature, Layer, Popup } from "react-mapbox-gl";
import { useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { ILocationDetail } from "../models/resModels";
import { handleAxiosError } from "../redux/login/thunk";
import styles from "./TestMap.module.scss";

const defaultZoom: [number] = [10.2];
const defaultCenter: [number, number] = [114.125, 22.35];
const BATTERY_MAX = 4.2;
const BATTERY_MIN = 3.6;
const localizationSelection = [
  {
    iso: "zh-Hant",
    innerHTML: "中"
  },
  {
    iso: "en",
    innerHTML: "Eng"
  }
];

const Map = ReactMapboxGL({
  accessToken: process.env.REACT_APP_MAPBOX_API_TOKEN!,
});

const TestMap = () => {
  const dispatch = useDispatch();
  const [map, setMap] = useState<mapboxgl.Map>();
  const [incidentPoints, setIncidentPoints] = useState<ILocationDetail[]>([]);
  const [hoverAnimate, setHoverAnimate] = useState({ onHover: false, idx: -1 });
  const [localization, setLocalization] = useState(localizationSelection[0].iso);

  const onMapLoad = async (map: mapboxgl.Map) => {
    setMap(map);
    map.getStyle().layers?.forEach(layer => {
      if (layer.id.endsWith("-label")) {
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
    map?.getStyle().layers?.forEach(layer => {
      if (layer.id.endsWith("-label")) {
        map.setLayoutProperty(layer.id, "text-field", ["get", `name_${localization}`]);
      }
    });
  }, [map, localization]);

  return (
    <>
    <Map
      // eslint-disable-next-line react/style-prop-object
      style="mapbox://styles/shinji1129/ckqyxuv0lcfmn18o9pgzhwgq4"
      // style="mapbox://styles/shinji1129/ckr4d9iy60ci317mte2mzob6k"
      // style="mapbox://styles/shinji1129/ckr4cxoe30c9i17muitq9vqvo"
      zoom={defaultZoom}
      center={defaultCenter}
      containerStyle={{ height: "80vh", width: "100vw", position: "absolute" }}
      onStyleLoad={map => onMapLoad(map)}
    >
      <>
        <Layer type="circle" paint={{ "circle-color": "#00F900", "circle-radius": 10 }}>
          {incidentPoints.map((point, idx) => (
            <Feature
              key={point.deviceId + idx}
              coordinates={[point.geolocation.y, point.geolocation.x]}
              onMouseEnter={() => setHoverAnimate({ onHover: true, idx })}
              onMouseLeave={() => setHoverAnimate({ onHover: false, idx })}
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
    <ul id={styles.localization}>
      {localizationSelection.map(i =>
        // eslint-disable-next-line jsx-a11y/role-supports-aria-props
        <li key={i.iso} onClick={() => setLocalization(i.iso)} aria-selected={localization === i.iso}>{i.innerHTML}</li> 
      )}
    </ul>
    </>
  );
};

export default TestMap;
