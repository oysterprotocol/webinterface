import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "components/shared/slicknav.css";
import "components/root.css";
import "components/responsive.css";

import RetrieveInProgress from "components/retrieve-in-progress";

const Root = () => (
  <div className="App">
    <RetrieveInProgress />
  </div>
);

export default Root;
