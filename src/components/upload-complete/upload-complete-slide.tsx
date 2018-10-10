import React from "react";
import styled from "styled-components";

import ClipboardBtn from "../shared/clipboard-button";
import Slide from "../shared/slide";

const HandleHeader = styled.span`
  color: #afcbfe;
  font-size: 20px;
  font-weight: 500;
`;

const OysterHandle = styled.p`
  color: #0068ea;
  font-size: 15px;
`;

const ICON_READY = require("../../assets/images/icon_ready.png");

const UploadCompleteSlide = ({ handle }) => (
  <Slide title="Upload Complete" image={ICON_READY}>
    <p>
      Your file has been successfully uploaded to the Tangle. An Oyster handle
      has been generated below. This handle is the only way to access your file
      on the Tangle. Please store this handle in a safe place.
    </p>
    <div>
      <p>
        <HandleHeader>Oyster Handle:</HandleHeader>
      </p>
      <OysterHandle id="oyster-handle">{handle}</OysterHandle>
      <ClipboardBtn text={handle}>Copy to clipboard</ClipboardBtn>
    </div>
  </Slide>
);

export default UploadCompleteSlide;
