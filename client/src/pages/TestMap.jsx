import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => (
  <div
    style={{
      width: "25px",
      height: "25px",
      background: "#0FF",
      borderRadius: "50%",
    }}
  />
);

class TestMap extends Component {
  static defaultProps = {
    center: {
      lat: 22.315136,
      lng: 114.21664,
    },
    zoom: 17,
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBx7Ij27LTfDI9SH8CWe_vVg5UXegxFyF4" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent lat={22.315136} lng={114.21664} text="My Marker" />
        </GoogleMapReact>
      </div>
    );
  }
}

export default TestMap;
