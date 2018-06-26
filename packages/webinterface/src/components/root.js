import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "components/shared/slicknav.css";
import "components/root.css";
import "components/responsive.css";

import PathChoice from "components/path-choice";

const Root = () => (
  <div className="App">
    <PathChoice />
  </div>
);

export default Root;
