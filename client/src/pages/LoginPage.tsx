import { push } from "connected-react-router";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";

function LoginPage() {
  const dispatch = useDispatch();
  const validLogin = {
    username: "admin1",
    password: "password",
  };
  const [login, setLogin] = useState({ username: "", password: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleLogin = () => {
    setIsSubmitted(true);
    if (
      login.password === validLogin.password &&
      login.username === validLogin.username
    ) {
      dispatch(push("/alertDataPage"));
    }
  };
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
        <div
          className="flex-center"
          style={{ width: "100%", margin: "40px 0" }}
        >
          <div style={{ width: "104px" }}>Username :</div>
          <input
            style={{
              width: "500px",
              marginLeft: "8px",
            }}
            value={login.username}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            onChange={(e) => {
              setIsSubmitted(false);
              setLogin({ username: e.target.value, password: login.password });
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
            value={login.password}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            onChange={(e) => {
              setIsSubmitted(false);
              setLogin({ username: login.username, password: e.target.value });
            }}
          />
        </div>
        {(isSubmitted ||
          login.password === validLogin.password ||
          login.username === validLogin.username) && (
          <div style={{ marginTop: "24px", color: "red" }}>
            Invalid Username or Password
          </div>
        )}
        <div
          className="flex-center formButtonContainer"
          style={{ width: "100%" }}
        >
          <div className="button" onClick={handleLogin}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
