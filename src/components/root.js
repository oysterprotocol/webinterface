import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "components/shared/slicknav.css";
import "components/root.css";
import "components/responsive.css";

import UploadStarted from "components/upload-started";

const Root = () => (
  <div className="App">
    <UploadStarted />
  </div>
);

export default Root;
