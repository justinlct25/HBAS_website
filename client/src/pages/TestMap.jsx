import React from "react";
import { useState } from "react";
import ReactMapboxGl, { Feature, Layer } from "react-mapbox-gl";
import "../css/TablePage.css";
const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2hpbmppMTEyOSIsImEiOiJja3F5eGcwYzMwYXlwMnVtbjhyOTl2OGI1In0.6BzqsFZ2JUSv2QkMWJy-ng";
const Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN,
});
function TestMap() {
  const [incidentLocation, setIncidentLocation] = useState({
    longitude: 114.21664,
    latitude: 22.315136,
  });

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <Map
        style={"mapbox://styles/shinji1129/ckr4d9iy60ci317mte2mzob6k"}
        containerStyle={{
          height: "100%",
          width: "100%",
        }}
        zoom={[12]}
        center={[114.21664, 22.315136]}
        onStyleLoad={() =>
          setIncidentLocation({ longitude: 114.21664, latitude: 22.315136 })
        }
      >
        <Layer
          type="circle"
          paint={{ "circle-color": "#00FFFF", "circle-radius": 10 }}
        >
          <Feature coordinates={[114.21664, 22.315136]} />
        </Layer>
      </Map>
    </div>
  );
}

export default TestMap;
