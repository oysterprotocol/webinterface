import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "components/shared/slicknav.css";
import "components/root.css";
import "components/responsive.css";

import RetrieveFile from "components/retrieve-file";

const Root = () => (
  <div className="App">
    <RetrieveFile />
  </div>
);

export default Root;
