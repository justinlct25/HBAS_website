import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setGlobalModal } from "../redux/global/action";

function ChangePassword() {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const dispatch = useDispatch();

  const allEqual = (arr: string[]) => arr.every((i) => i === arr[0]);

  const handleSubmit = async () => {
    if (allEqual(Object.values(passwords))) {
      dispatch(
        setGlobalModal({
          isOpen: true,
          content: "Old password and new password are the same, please try again",
        })
      );
      return;
    }
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      dispatch(
        setGlobalModal({ isOpen: true, content: "New passwords do not match, please try again" })
      );
      return;
    }
    try {
      const res = await axios.post(`/login/change-password`, passwords);
      console.log(res.data);
      dispatch(setGlobalModal({ isOpen: true, content: "Password changed" }));
      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.error(error);
      dispatch(
        setGlobalModal({ isOpen: true, content: "Old password is incorrect, please try again" })
      );
    }
  };
  return (
    <section>
      <form className="my-4">
        <div className="my-4">
          <h5>Old password</h5>
          <input
            type="password"
            className="searchInput"
            style={{ borderBottom: "solid 1px #555" }}
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
          />
        </div>
        <div className="my-4">
          <h5>New password</h5>
          <input
            type="password"
            className="searchInput"
            style={{ borderBottom: "solid 1px #555" }}
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
        </div>
        <div className="my-4">
          <h5>Confirm new password</h5>
          <input
            type="password"
            className="searchInput"
            style={{ borderBottom: "solid 1px #555" }}
            value={passwords.confirmNewPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
          />
        </div>
        <button
          className="deleteCompanyButton"
          style={{ border: "none", background: "var(--primaryButtonColor)" }}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          CONFIRM
        </button>
      </form>
    </section>
  );
}

export default ChangePassword;
