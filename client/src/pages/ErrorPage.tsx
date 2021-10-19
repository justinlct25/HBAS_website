import React from "react";
import { useHistory } from "react-router";

function ErrorPage() {
  const history = useHistory();
  return (
    <div className="flex-center full-width" style={{ height: "calc(90vh - var(--topNavHeight))" }}>
      <div className="flex-column-start full-width">
        <h2 className="primaryText m-0">Page not found</h2>
        <h4 className="my-4 primaryText">The page you are looking for does not exist</h4>
        <div
          className="my-2 deleteCompanyButton"
          style={{ background: "var(--primaryButtonColor)", width: "200px" }}
          onClick={() => {
            history.goBack();
          }}
        >
          Go back
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
