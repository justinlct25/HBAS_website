import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/login/thunk";
import { IRootState } from "../redux/store";
import styles from "./LoginPage.module.scss";
import { setIsLoadingAction } from "../redux/loading/action";
import Loading from "../components/Loading";

function LoginPage() {
  const [loginInput, setLoginInput] = useState({ username: "", password: "" });
  const [companyName, setCompanyName] = useState("BEE");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: IRootState) => state.login.isLoggedIn);
  const isLoading = useSelector((state: IRootState) => state.loading.loading.isLoading);

  const handleSubmit = () => {
    dispatch(login(loginInput.username, loginInput.password));
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(push("/latest-locations"));
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    dispatch(setIsLoadingAction(true));
    const pathname = window.location.hostname.split(".");
    if (pathname[0] === "handbrake") {
      setCompanyName("Muse Labs");
    } else {
      setCompanyName("BEE");
    }
    dispatch(setIsLoadingAction(false));
  }, []);

  return (
    <div className={`${styles.container}${isMobile ? " " + styles.mobile : ""}`}>
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className="full-width">
          {/* Please use semantic tags like <h1> instead...
        And fix the css on TablePage.css so it doesn't override <h1> globally... */}
          <div>{`${companyName} - Handbrake Alert System`}</div>
          <div>Admin Login</div>
          <form
            className="full-width flex-column-center"
            style={{ alignItems: "flex-start" }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="my-4 full-width">
              <div>Username :</div>
              <input
                value={loginInput.username}
                onChange={(e) => {
                  setLoginInput({
                    username: e.target.value,
                    password: loginInput.password,
                  });
                }}
              />
            </div>
            <div className="my-4 full-width">
              <div>Password :</div>
              <input
                type="password"
                onChange={(e) => {
                  setLoginInput({
                    username: loginInput.username,
                    password: e.target.value,
                  });
                }}
              />
            </div>
            <button className="button" type="submit">
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
