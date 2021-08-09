import React from "react";
import "../css/Loading.css";

function Loading() {
  const dots = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ];
  const distanceBetweenDots = 24;
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
        backdropFilter: "blur(1.2px)",
      }}
    >
      <div
        style={{
          position: "absolute",
          transform: "translateY(16px)",
          fontSize: "24px",
          color: "#333",
        }}
      >
        Loading
      </div>
      <div className="dotContainer">
        {dots.map((dot, idx) => {
          return (
            <div
              key={`dot-1-${idx}`}
              className="eachDot"
              style={{
                transform: `
                rotateY(${(dot.id + 1) * (360 / dots.length)}deg) 
                translateZ(${dots.length * distanceBetweenDots}px)`,
              }}
            />
          );
        })}
        {dots.map((dot, idx) => {
          return (
            <div
              key={`dot-2-${idx}`}
              className="eachDot"
              style={{
                transform: `
                rotateX(${(dot.id + 1) * (360 / dots.length)}deg) 
                rotateY(${(dot.id + 1) * (360 / dots.length)}deg) 
                translateZ(${dots.length * distanceBetweenDots}px)`,
              }}
            />
          );
        })}
        {dots.map((dot, idx) => {
          return (
            <div
              key={`dot-3-${idx}`}
              className="eachDot"
              style={{
                transform: `
                rotateX(${(dot.id + 1.5) * (360 / dots.length)}deg) 
                rotateY(${(dot.id + 1.5) * (360 / dots.length)}deg) 
                translateZ(${dots.length * distanceBetweenDots}px)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Loading;
