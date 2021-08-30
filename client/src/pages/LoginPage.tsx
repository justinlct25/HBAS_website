import { push } from "connected-react-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/login/thunk";
import { IRootState } from "../redux/store";

function LoginPage() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: IRootState) => state.login.isLoggedIn);

  const [loginInput, setLoginInput] = useState({ username: "", password: "" });

  const handleSubmit = () => {
    dispatch(login(loginInput.username, loginInput.password));
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(push("/latest-locations"));
    }
  }, [dispatch, isLoggedIn]);

  return (
    <div
      className="flex-center"
      style={{
        width: "100vw",
        height: "calc(100vh - var(--topNavHeight))",
      }}
    >
      <div style={{ width: "50%", height: "80%" }}>
        <div className="titleText">Muse Labs - Handbrake Alert System</div>
        <div className="titleText">Admin Login</div>
        <div className="flex-center" style={{ width: "100%", margin: "40px 0" }}>
          <div style={{ width: "104px" }}>Username :</div>
          <input
            style={{
              width: "500px",
              marginLeft: "8px",
            }}
            value={loginInput.username}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            onChange={(e) => {
              setLoginInput({
                username: e.target.value,
                password: loginInput.password,
              });
            }}
          />
        </div>
        <div className="flex-center" style={{ width: "100%" }}>
          <div style={{ width: "104px" }}>Password :</div>
          <input
            type="password"
            style={{
              width: "500px",
              marginLeft: "8px",
            }}
            value={loginInput.password}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            onChange={(e) => {
              setLoginInput({
                username: loginInput.username,
                password: e.target.value,
              });
            }}
          />
        </div>

        <div className="flex-center formButtonContainer" style={{ width: "100%" }}>
          <div className="button" onClick={handleSubmit}>
            Login
          </div>
          {/* <div>
            second time
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
