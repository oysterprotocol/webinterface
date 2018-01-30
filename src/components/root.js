import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "components/shared/slicknav.css";
import "components/root.css";
import "components/responsive.css";

import Header from "components/header";
import Main from "components/main";


const Root = () => (
  <div className="App">
    <Header />
    <Main />
  </div>
);

export default Root;
