import GoogleMapReact from "google-map-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useRouter } from "../helpers/useRouter";
import { BackButton } from "./IconsOnly";

type lastSeenLocations = Array<{
  address: string;
  battery: string;
  date: string;
  deviceId: number;
  geolocation: { x: number; y: number };
  id: number;
  msgType: string;
}>;

interface IncidentPointProps {
  lat: number;
  lng: number;
  backgroundColor: string;
  children: React.ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}
const IncidentPoint = (props: IncidentPointProps) => {
  const {
    lat,
    lng,
    children,
    backgroundColor,
    onMouseEnter,
    onMouseLeave,
  } = props;
  return (
    <div
      className="flex-center"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: "20px",
        height: "20px",
        background: backgroundColor,
        borderRadius: "50%",
      }}
    >
      {children}
    </div>
  );
};

const { REACT_APP_API_SERVER, REACT_APP_API_VERSION } = process.env;

const VehicleLogs = () => {
  const router = useRouter();
  const history = useHistory();
  const dispatch = useDispatch();

  const [incidentPoints, setIncidentPoints] = useState<lastSeenLocations>([]);
  const [hoverAnimate, setHoverAnimate] = useState({ onHover: false, idx: -1 });

  useEffect(() => {
    const splitRoute = router.pathname.split("/");
    const deviceId = splitRoute[splitRoute.length - 1];
    const fetchLocationHistory = async () => {
      try {
        const url = new URL(
          `${REACT_APP_API_VERSION}/alert-data/history/${deviceId}`,
          `${REACT_APP_API_SERVER}`
        );

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        if (res.status === 200) {
          const result = await res.json();
          console.log(result.data);
          setIncidentPoints(result.data);
        }
      } catch (e) {
        console.error(e.message);
      }
    };
    fetchLocationHistory();
  }, [dispatch]);

  return (
    <div className="flex-center pageContainer">
      <div
        className="flex-center topRowContainer"
        style={{ justifyContent: "space-between" }}
      >
        <div
          className="flex-center"
          style={{ cursor: "pointer" }}
          onClick={() => {
            history.goBack();
          }}
        >
          <div className="flex-center">
            <BackButton />
            <div style={{ margin: "8px", fontSize: "24px" }}>BACK</div>
          </div>
        </div>
      </div>
      <div
        className="flex-center"
        style={{ height: "70vh", width: "100%", transform: "translateY(24px)" }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_API_GOOGLE_MAP as string,
          }}
          defaultCenter={{
            lat: 22.3560207,
            lng: 114.1131052,
          }}
          defaultZoom={11.67}
        >
          {!incidentPoints.length && (
            <div className="flex-center noAvailableData">No available data</div>
          )}
          {incidentPoints.length &&
            incidentPoints.map((item, idx) => {
              const checking = hoverAnimate.onHover && hoverAnimate.idx === idx;
              return (
                <IncidentPoint
                  onMouseEnter={() => setHoverAnimate({ onHover: true, idx })}
                  onMouseLeave={() => setHoverAnimate({ onHover: false, idx })}
                  key={idx}
                  lat={item.geolocation.x}
                  lng={item.geolocation.y}
                  backgroundColor={item.msgType === "A" ? "#F00C" : "#00F9"}
                >
                  <div style={{ color: "#EEE" }}>{idx + 1}</div>
                  <div
                    className="flex-center tooltip"
                    style={{
                      top: checking ? "-120px" : 0,
                      opacity: checking ? 1 : 0,
                    }}
                  >
                    <div className="flex-center">
                      <div className="tooltipField">{"Date:"}</div>
                      <div style={{ color: "#EEE" }}>
                        {new Date(item.date).toLocaleDateString("en-CA")}
                      </div>
                    </div>
                    <div className="flex-center">
                      <div className="tooltipField">{"Time:"}</div>
                      <div style={{ color: "#EEE" }}>
                        {new Date(item.date).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex-center">
                      <div className="tooltipField">{"Battery:"}</div>
                      <div style={{ color: "#EEE" }}>{item.battery}</div>
                    </div>
                  </div>
                </IncidentPoint>
              );
            })}
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default VehicleLogs;
