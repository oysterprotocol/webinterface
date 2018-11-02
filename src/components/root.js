import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shared/slicknav.css";
import "./responsive.css";
import styled from "styled-components";

import PathChoice from "./path-choice";

const AppContainer = styled.div`
  font-family: "Poppins", sans-serif;
`;

const Root = () => (
  <AppContainer className="App">
    <PathChoice />
  </AppContainer>
);

export default Root;
