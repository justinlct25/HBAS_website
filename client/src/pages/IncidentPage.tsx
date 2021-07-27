import React, { useEffect, useState } from "react";
import ReactMapboxGl, { Feature, Layer } from "react-mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BackButton, CaretIcon } from "../components/IconsOnly";
import "../css/TablePage.css";
import { useRouter } from "../helpers/useRouter";
import { IRootState } from "../redux/store";
import { incidentRecordsTableHeaders } from "../table/tableHeader";

const tableHeaders = incidentRecordsTableHeaders;
const TABLE_WIDTH = "85%";
const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2hpbmppMTEyOSIsImEiOiJja3F5eGcwYzMwYXlwMnVtbjhyOTl2OGI1In0.6BzqsFZ2JUSv2QkMWJy-ng";
const Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN,
});
function IncidentPage() {
  const router = useRouter();
  const history = useHistory();
  const alertDataPage = useSelector((state: IRootState) => state.alertDataPage);
  const alertDataList = alertDataPage.alertDataList;
  const incidentPageData = useSelector(
    (state: IRootState) => state.incidentPage.incidentPage
  );
  const [isLiveView, setIsLiveView] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(true);
  const [incidentLocation, setIncidentLocation] = useState<{
    longitude: number;
    latitude: number;
  }>();

  const companiesDataList = useSelector(
    (state: IRootState) => state.companiesDataList
  );
  const companiesList = companiesDataList.companiesDataList;
  const data = useSelector(
    (state: IRootState) => state.incidentPage.incidentPage
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchIncidentById = async () => {
      const splitRoute = router.pathname.split("/");
      const routeId = splitRoute[splitRoute.length - 1];
      //fetch action
      // fetch(`http:\\gsregsergsreg${routeId}`)
    };

    setIncidentLocation({
      longitude: incidentPageData.longitude,
      latitude: incidentPageData.latitude,
    });
    fetchIncidentById();
  }, [dispatch, router.pathname]);

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
            style={
              isLiveView
                ? "mapbox://styles/shinji1129/ckr4cxoe30c9i17muitq9vqvo"
                : "mapbox://styles/shinji1129/ckr4d9iy60ci317mte2mzob6k"
            }
            containerStyle={{
              height: "100%",
              width: "100%",
            }}
            zoom={[12]}
            center={[Number(data.longitude), Number(data.latitude)]}
          >
            <Layer
              type="circle"
              paint={{ "circle-color": "#00FFFF", "circle-radius": 10 }}
            >
              <Feature
                coordinates={[Number(data.longitude), Number(data.latitude)]}
              />
            </Layer>
          </Map>
          <div
            className={
              isReportOpen
                ? "flex-center caretButton"
                : "flex-center caretButton hiddenReport"
            }
            style={{
              width: isReportOpen ? "30%" : "3%",
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
                    <div className="incidentReportText">{data.deviceId}</div>
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
