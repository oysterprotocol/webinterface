import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "components/shared/slicknav.css";
import "components/root.css";
import "components/responsive.css";

import UploadComplete from "components/upload-complete";

const Root = () => (
  <div className="App">
    <UploadComplete />
  </div>
);

export default Root;
