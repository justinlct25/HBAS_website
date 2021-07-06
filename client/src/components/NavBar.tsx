import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import { CompanyName } from "./CompanyName";
import { CaretIcon, GraphViewIcon, SearchIcon } from "./IconsOnly";
import "../css/NavBar.css";
import { tableHeaders } from "../table/tableHeader";

function NavBar() {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();

  const toggleNavbar = () => setCollapsed(!collapsed);

  const [isOpen, setIsOpen] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");

  const HomeBand = () => {
    dispatch(push("/"));
  };
  const HomeClick = () => {
    toggleNavbar();
    dispatch(push("/"));
  };
  const AlertDataPage = () => {
    toggleNavbar();
    dispatch(push("/alertData"));
  };
  return (
    <div className="topNavContainer">
      <div className="topNavContent">
        <CompanyName />
        <div className="flex-center" style={{ position: "relative" }}>
          <div style={{ padding: "8px" }}>Search by:</div>
          <div
            style={{
              color: placeHolderText === "Select" ? "#ccc" : "#555",
              minWidth: "64px",
              transition: "all 1s ease",
            }}
          >
            {placeHolderText}
          </div>
          <div
            style={{
              padding: "8px",
              cursor: "pointer",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <CaretIcon />
          </div>
          <div className="flex-center" style={{ padding: "8px" }}>
            <input
              className="searchInput"
              placeholder={"Search"}
              style={{
                width: placeHolderText !== "Select" ? "240px" : "0px",
              }}
            />
            <div style={{ cursor: "pointer", padding: "8px" }}>
              <SearchIcon />
            </div>
          </div>
          <div
            className="dropDownListContainer"
            style={{
              maxHeight: isOpen ? `${(tableHeaders.length + 1) * 40}px` : 0,
            }}
          >
            {isOpen &&
              tableHeaders.map((item, idx) => {
                return (
                  <div
                    key={idx}
                    className="dropDownItem"
                    style={{ height: isOpen ? "48px" : "0px" }}
                    onClick={() => {
                      setPlaceHolderText(item);
                      setIsOpen(false);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
          </div>
        </div>
        <div
          className="flex-center"
          style={{ height: "100%", padding: "8px", cursor: "pointer" }}
        >
          <GraphViewIcon />
        </div>
      </div>

      <div
        style={{
          width: "100%",
          border: "solid 0.5px #aaaa",
        }}
      />
    </div>
    // <div>
    //   <Navbar color="faded" light>
    //     <NavbarBrand onClick={HomeBand} className="mr-auto">
    //       <label>Handbrake System</label>
    //     </NavbarBrand>
    //     <NavbarToggler onClick={toggleNavbar} className="mr-2" />
    //     <Collapse isOpen={!collapsed} navbar>
    //       <Nav navbar>
    //         <NavItem
    //           style={{
    //             position: "absolute",
    //             width: "10vw",
    //             height: "100vh",
    //             backgroundColor: " red",
    //           }}
    //         >
    //           <NavLink onClick={HomeClick}>
    //             <label>Home page</label>
    //           </NavLink>
    //         </NavItem>
    //         <NavItem>
    //           <NavLink onClick={AlertDataPage}>
    //             <label>Alert page</label>
    //           </NavLink>
    //         </NavItem>
    //       </Nav>
    //     </Collapse>
    //   </Navbar>
    // </div>
  );
}

export default NavBar;
