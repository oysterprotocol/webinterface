import React from "react";
import styled from "styled-components";

import Slide from "../shared/slide";

const ICON_SPINNER = require("../../assets/images/icon_spinner.png");
const ICON_DOWNLOAD = require("../../assets/images/icon_download.png");

const RetrievalInstructions = styled.p`
  padding-bottom: 50px;
`;

const SpinnerWrapper = styled.div`
  padding-left: 100px;
`;

const DownloadStartedSlide = () => (
  <Slide title="Retrieving file..." image={ICON_DOWNLOAD}>
    <RetrievalInstructions>
      Your file is being retrieved from the Tangle.
    </RetrievalInstructions>
    <SpinnerWrapper>
      <img src={ICON_SPINNER} alt="spinner" />
    </SpinnerWrapper>
  </Slide>
);

export default DownloadStartedSlide;
