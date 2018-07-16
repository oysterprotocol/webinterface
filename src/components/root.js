import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shared/slicknav.css";
import "./root.css";
import "./responsive.css";

import PathChoice from "./path-choice";

const Root = () => (
  <div className="App">
    <PathChoice />
  </div>
);

export default Root;
