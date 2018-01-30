import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "components/shared/slicknav.css";
import "components/root.css";
import "components/responsive.css";

import UploadForm from "components/upload-form";

const Root = () => (
  <div className="App">
    <UploadForm />
  </div>
);

export default Root;
