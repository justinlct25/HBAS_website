import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import ReactMapboxGL, { Feature, Layer, Popup } from "react-mapbox-gl";

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

const Map = ReactMapboxGL({ accessToken: process.env.REACT_APP_MAPBOX_API_TOKEN! });

const TestMap = () => {
  const [incidentPoints, setIncidentPoints] = useState<lastSeenLocations>([]);
  const [hoverAnimate, setHoverAnimate] = useState({ onHover: false, idx: -1 });

  return (
      <Map
        // eslint-disable-next-line react/style-prop-object
        style="mapbox://styles/shinji1129/ckqyxuv0lcfmn18o9pgzhwgq4"
        zoom={[10.5]}
        center={[114.14865316808854, 22.35499699048897]}
        containerStyle={{ height: "80vh" }}
        onStyleLoad={async () => {
          try {
            const res = await fetch(
              `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_API_VERSION}/alert-data/latest-locations`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json; charset=utf-8",
                },
              }
            );
            const result = await res.json();
            setIncidentPoints(result.data);
          } catch (e) {
            console.error(e.message);
          }
      }}
      >
        <>
          <Layer
            type="circle"
            paint={{ "circle-color": "#00FFFF", "circle-radius": 10 }}
          >
            {incidentPoints.map((point, idx) => 
              <Feature
                key={idx}
                coordinates={[point.geolocation.y, point.geolocation.x]}
                onMouseEnter={() => setHoverAnimate({ onHover: true, idx })}
                onMouseLeave={() => setHoverAnimate({ onHover: false, idx })}
              />
            )}
          </Layer>
          <CSSTransition
            in={hoverAnimate.onHover}
            timeout={400}
            classNames="popup"
            mountOnEnter
            unmountOnExit
          >
            {incidentPoints[hoverAnimate.idx] ?
            <Popup
              coordinates={[incidentPoints[hoverAnimate.idx].geolocation.y, incidentPoints[hoverAnimate.idx].geolocation.x]}
              anchor="bottom-right"
              className="popup"
            >
              
            </Popup> : <></>}
          </CSSTransition>
        </>
      </Map>
  );
  // return (
  //   // Important! Always set the container height explicitly
  //   <div
  //     className="flex-center"
  //     style={{ height: "80vh", width: "100%", transform: "translateY(24px)" }}
  //   >
  //     <GoogleMapReact
  //       bootstrapURLKeys={{
  //         key: process.env.REACT_APP_API_GOOGLE_MAP as string,
  //       }}
  //       defaultCenter={{
  //         lat: 22.3560207,
  //         lng: 114.1131052,
  //       }}
  //       defaultZoom={11.67}
  //     >
  //       {incidentPoints.map((item, idx) => {
  //         const checking = hoverAnimate.onHover && hoverAnimate.idx === idx;
  //         return (
  //           <IncidentPoint
  //             onMouseEnter={() => setHoverAnimate({ onHover: true, idx })}
  //             onMouseLeave={() => setHoverAnimate({ onHover: false, idx })}
  //             key={idx}
  //             lat={item.geolocation.x}
  //             lng={item.geolocation.y}
  //             backgroundColor={item.msgType === "A" ? "#F00C" : "#00F9"}
  //           >
  //             <div
  //               className="flex-center tooltip"
  //               style={{
  //                 top: checking ? "-120px" : 0,
  //                 opacity: checking ? 1 : 0,
  //               }}
  //             >
  //               <div className="flex-center">
  //                 <div className="tooltipField">{"Device ID:"}</div>
  //                 <div style={{ color: "#EEE" }}>{item.deviceEui}</div>
  //               </div>
  //               <div className="flex-center">
  //                 <div className="tooltipField">{"Date:"}</div>
  //                 <div style={{ color: "#EEE" }}>
  //                   {new Date(item.date).toLocaleDateString("en-CA")}
  //                 </div>
  //               </div>
  //               <div className="flex-center">
  //                 <div className="tooltipField">{"Time:"}</div>
  //                 <div style={{ color: "#EEE" }}>
  //                   {new Date(item.date).toLocaleTimeString()}
  //                 </div>
  //               </div>
  //               <div className="flex-center">
  //                 <div className="tooltipField">{"Company:"}</div>
  //                 <div style={{ color: "#EEE" }}>{item.companyName}</div>
  //               </div>

  //               <div className="flex-center">
  //                 <div className="tooltipField">{"Car Plate:"}</div>
  //                 <div style={{ color: "#EEE" }}>{item.carPlate}</div>
  //               </div>
  //             </div>
  //           </IncidentPoint>
  //         );
  //       })}
  //     </GoogleMapReact>
  //   </div>
  // );
};

export default TestMap;
