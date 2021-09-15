import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/login/thunk";
import { IRootState } from "../redux/store";
import styles from "./LoginPage.module.scss";

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
    <div className={`${styles.container}${isMobile ? " " + styles.mobile : ""}`}>
      <div>
        {/* Please use semantic tags like <h1> instead...
        And fix the css on TablePage.css so it doesn't override <h1> globally... */}
        <div className="titleText">Muse Labs - Handbrake Alert System</div>
        <div className="titleText">Admin Login</div>
        <form onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}>
          <label>Username :</label>
          <input
            value={loginInput.username}
            onChange={(e) => {
              setLoginInput({
                username: e.target.value,
                password: loginInput.password,
              });
            }}
          />
          <label>Password :</label>
          <input
            type="password"
            onChange={(e) => {
              setLoginInput({
                username: loginInput.username,
                password: e.target.value,
              });
            }}
          />
          <button className="button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
