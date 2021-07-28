import anime from "animejs";
import { push } from "connected-react-router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "../css/NavBar.css";
import { useRouter } from "../helpers/useRouter";
import { CompanyName } from "./CompanyName";
import MenuButton from "./MenuButton";

function NavBar() {
  const router = useRouter();
  const splitRoute = router.pathname;

  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();

  const toggleNavbar = () => setCollapsed(!collapsed);

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const menuItem = [
    { display: "Incident Records", link: "/alert-data-page" },
    { display: "Manage User", link: "/manage-user" },
    { display: "Manage Device", link: "/manage-device" },
    { display: "Statistics (Coming soon)", link: "/statistics" },
  ];

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
  const closePathA =
    "M28 17.5 C29.933 17.5 31.5 15.933 31.5 14C31.5 12.067 29.933 10.5 28 10.5C26.067 10.5 24.5 12.067 24.5 14C24.5 15.933 26.067 17.5 28 17.5Z M28 31.5C29.933 31.5 31.5 29.933 31.5 28C31.5 26.067 29.933 24.5 28 24.5C26.067 24.5 24.5 26.067 24.5 28C24.5 29.933 26.067 31.5 28 31.5Z M28 45.5C29.933 45.5 31.5 43.933 31.5 42C31.5 40.067 29.933 38.5 28 38.5C26.067 38.5 24.5 40.067 24.5 42C24.5 43.933 26.067 45.5 28 45.5Z";

  const openPathA =
    "M0.762563 0.762563C1.44598 0.0791457 2.55402 0.0791457 3.23744 0.762563L26.5 24.0251L49.7626 0.762563C50.446 0.0791457 51.554 0.0791457 52.2374 0.762563C52.9209 1.44598 52.9209 2.55402 52.2374 3.23744L28.9749 26.5L52.2374 49.7626C52.9209 50.446 52.9209 51.554 52.2374 52.2374C51.554 52.9209 50.446 52.9209 49.7626 52.2374L26.5 28.9749L3.23744 52.2374C2.55402 52.9209 1.44598 52.9209 0.762563 52.2374C0.0791457 51.554 0.0791457 50.446 0.762563 49.7626L24.0251 26.5L0.762563 3.23744C0.0791457 2.55402 0.0791457 1.44598 0.762563 0.762563Z";

  const handleClick = () => {
    const timeline = anime.timeline({
      duration: 300,
      easing: "easeOutExpo",
    });
    timeline.add({
      targets: ".menuPointA",
      d: [{ value: !menuIsOpen ? openPathA : closePathA }],
    });
    if (menuIsOpen) {
      setMenuIsOpen(false);
    } else {
      setMenuIsOpen(true);
    }
  };

  return (
    <div className="topNavContainer">
      {splitRoute !== "/login" && (
        <>
          <div className="topNavContent">
            <CompanyName />

            <div
              className="flex-center"
              style={{
                height: "100%",
                padding: "8px",
                cursor: "pointer",
              }}
            >
              {/* <GraphViewIcon /> */}
              <MenuButton isOpen={menuIsOpen} handleClick={handleClick} />
            </div>

            <div
              className="rightMenu"
              style={{
                right: menuIsOpen ? 0 : "-150%",
              }}
            >
              <div className="flex-center menuItemContainer">
                {menuItem.map((item, idx) => {
                  return (
                    <Link
                      key={"menuItem" + idx}
                      to={item.link}
                      style={{
                        width: "100%",
                        color: "none",
                        textDecoration: "none",
                      }}
                    >
                      <div className="flex-center menuItem">{item.display}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              border: "solid 0.5px #aaaa",
            }}
          />
        </>
      )}
      {menuIsOpen && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: 0,
          }}
          onClick={() => {
            setMenuIsOpen(false);
            handleClick();
          }}
        />
      )}
    </div>
  );
}

export default NavBar;
