import React from "react";

export interface NavMainProps {
  isOpen: boolean;
  handleClick: () => void;
}

function MenuButton(props: NavMainProps) {
  const { isOpen, handleClick } = props;

  return (
    <div
      className="svgContainer"
      onClick={handleClick}
      style={{
        zIndex: 2,
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        width="53"
        height="53"
        viewBox="0 0 53 53"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="menuPointA"
          d="M28 17.5C29.933 17.5 31.5 15.933 31.5 14C31.5 12.067 29.933 10.5 28 10.5C26.067 10.5 24.5 12.067 24.5 14C24.5 15.933 26.067 17.5 28 17.5Z M28 31.5C29.933 31.5 31.5 29.933 31.5 28C31.5 26.067 29.933 24.5 28 24.5C26.067 24.5 24.5 26.067 24.5 28C24.5 29.933 26.067 31.5 28 31.5Z M28 45.5C29.933 45.5 31.5 43.933 31.5 42C31.5 40.067 29.933 38.5 28 38.5C26.067 38.5 24.5 40.067 24.5 42C24.5 43.933 26.067 45.5 28 45.5Z"
          fill={isOpen ? "#eee" : "#555"}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default MenuButton;
