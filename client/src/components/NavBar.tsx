import anime from "animejs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../css/NavBar.css";
import { useRouter } from "../helpers/useRouter";
import {
  expandNotificationMessageAction,
  setNotificationAction,
  setNotificationMessage,
} from "../redux/notification/action";
import { IRootState } from "../redux/store";
import { CompanyName } from "./CompanyName";
import { NotificationAlertIcon, NotificationIcon } from "./IconsOnly";
import MenuButton from "./MenuButton";

function NavBar() {
  const router = useRouter();
  const splitRoute = router.pathname;
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [notificationIds, setNotificationIds] = useState<number[]>([]);

  const menuItem = [
    { display: "Incident Records", link: "/alert-data-page" },
    { display: "Pulse Message", link: "/pulse-message" },
    { display: "Manage User", link: "/manage-user" },
    { display: "Manage Device", link: "/manage-device" },
    { display: "Latest Locations", link: "/latest-locations" },
  ];

  const closePathA =
    "M28 17.5 C29.933 17.5 31.5 15.933 31.5 14C31.5 12.067 29.933 10.5 28 10.5C26.067 10.5 24.5 12.067 24.5 14C24.5 15.933 26.067 17.5 28 17.5Z M28 31.5C29.933 31.5 31.5 29.933 31.5 28C31.5 26.067 29.933 24.5 28 24.5C26.067 24.5 24.5 26.067 24.5 28C24.5 29.933 26.067 31.5 28 31.5Z M28 45.5C29.933 45.5 31.5 43.933 31.5 42C31.5 40.067 29.933 38.5 28 38.5C26.067 38.5 24.5 40.067 24.5 42C24.5 43.933 26.067 45.5 28 45.5Z";

  const openPathA =
    "M0.762563 0.762563C1.44598 0.0791457 2.55402 0.0791457 3.23744 0.762563L26.5 24.0251L49.7626 0.762563C50.446 0.0791457 51.554 0.0791457 52.2374 0.762563C52.9209 1.44598 52.9209 2.55402 52.2374 3.23744L28.9749 26.5L52.2374 49.7626C52.9209 50.446 52.9209 51.554 52.2374 52.2374C51.554 52.9209 50.446 52.9209 49.7626 52.2374L26.5 28.9749L3.23744 52.2374C2.55402 52.9209 1.44598 52.9209 0.762563 52.2374C0.0791457 51.554 0.0791457 50.446 0.762563 49.7626L24.0251 26.5L0.762563 3.23744C0.0791457 2.55402 0.0791457 1.44598 0.762563 0.762563Z";

  const handleClick = () => {
    setMenuIsOpen(false);
    dispatch(expandNotificationMessageAction(false));
  };
  useEffect(() => {
    const timeline = anime.timeline({
      duration: 300,
      easing: "easeOutExpo",
    });
    timeline.add({
      targets: ".menuPointA",
      d: [{ value: menuIsOpen ? openPathA : closePathA }],
    });
  }, [menuIsOpen]);

  const handleClick2 = () => {
    if (menuIsOpen) {
      setMenuIsOpen(false);
      const timeline = anime.timeline({
        duration: 300,
        easing: "easeOutExpo",
      });
      timeline.add({
        targets: ".menuPointA",
        d: [{ value: closePathA }],
      });
    } else {
      const timeline = anime.timeline({
        duration: 300,
        easing: "easeOutExpo",
      });
      timeline.add({
        targets: ".menuPointA",
        d: [{ value: openPathA }],
      });
      setMenuIsOpen(true);
    }
  };

  const dispatch = useDispatch();
  const notification = useSelector((state: IRootState) => state.notification.notification);
  const showNotification = notification.showNotification;
  const expandNotification = notification.expandNotification;

  const reallyNoMessage = notification.message.length < 1;

  useEffect(() => {
    const fetchLowBatteryNotification = async () => {
      try {
        const res = await axios.get(`/alert-data/battery`);
        const result = res.data;
        console.log("result");
        console.log(result);
        dispatch(setNotificationMessage(result.data));
      } catch (e) {
        console.error(e.Message);
      }
    };
    fetchLowBatteryNotification();
  }, []);

  useEffect(() => {
    const tempArr = notification.message.map((i) => i.id);
    setNotificationIds(tempArr);
  }, [expandNotification]);

  // useEffect(() => {
  //   const notedWithThanks = async () => {
  //     try {
  //       await axios.put(`alert-data/battery`, {
  //         notificationIds,
  //       });
  //     } catch (e) {
  //       console.error(e.message);
  //     }
  //   };
  //   notedWithThanks();
  // }, [notificationIds]);

  return (
    <div className="topNavContainer">
      {splitRoute !== "/login" && (
        <>
          <div className="topNavContentContainer">
            <div className="topNavItemContainer">
              <CompanyName />
              <div className="flex-center">
                <div
                  className="flex-center menuButtonContainer"
                  style={{ marginRight: "24px", position: "relative" }}
                  onClick={() => {
                    dispatch(expandNotificationMessageAction(!expandNotification));
                  }}
                >
                  {showNotification ? <NotificationAlertIcon /> : <NotificationIcon />}
                  {expandNotification && (
                    <div className="notificationModal">
                      <h4 style={{ marginBottom: "24px" }}>Low battery alert</h4>
                      {reallyNoMessage ? (
                        <div>{"No message yet"}</div>
                      ) : (
                        notification.message.map((message) => {
                          return (
                            <div key={`message-${message.id}`} className="notificationContainer">
                              <div style={{ textAlign: "left" }}>
                                {message.deviceEui}{" "}
                                <span style={{ color: "red" }}>({message.deviceName})</span>
                                <br />
                                {new Date(message.date).toLocaleString("en-CA")}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-center menuButtonContainer">
                  <MenuButton isOpen={menuIsOpen} handleClick={() => setMenuIsOpen(!menuIsOpen)} />
                </div>
              </div>
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
                        height: "80px",
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
      {(menuIsOpen || expandNotification) && (
        <div
          className="clickElsewhereMain"
          onClick={() => {
            handleClick();
          }}
        />
      )}
    </div>
  );
}

export default NavBar;
