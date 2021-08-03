import GoogleMapReact from "google-map-react";
import React, { useEffect, useState } from "react";

type lastSeenLocations = Array<{
  battery: string;
  carPlate: string;
  companyName: string;
  date: string;
  deviceEui: string;
  deviceId: number;
  deviceName: string;
  geolocation: { x: number; y: number };
  msgType: string;
}>;

interface IncidentPointProps {
  lat: number;
  lng: number;
}
const IncidentPoint = (props: IncidentPointProps) => {
  const { lat, lng } = props;
  return (
    <div
      style={{
        width: "25px",
        height: "25px",
        background: "#0FF",
        borderRadius: "50%",
      }}
    />
  );
};

const TestMap = () => {
  const [incidentPoints, setIncidentPoints] = useState<lastSeenLocations>([]);

  useEffect(() => {
    const fetchLatestLocations = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_SERVER}/fix/alert-data/latest-locations`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
        const result = await res.json();
        console.log(result.data);
        setIncidentPoints(result.data);
      } catch (e) {
        console.error(e.message);
      }
    };
    fetchLatestLocations();
  }, []);

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
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
        {incidentPoints.map((item, idx) => {
          return (
            <IncidentPoint
              key={idx}
              lat={item.geolocation.x}
              lng={item.geolocation.y}
            />
          );
        })}
        {/* <IncidentPoint
            lat={incidentLocation.latitude}
            lng={incidentLocation.longitude}
          /> */}
      </GoogleMapReact>
    </div>
  );
};

export default TestMap;
