import React from "react";
import styled from "styled-components";

import ClipboardBtn from "../shared/clipboard-button";
import Slide from "../shared/slide";

const ICON_READY = require("../../assets/images/icon_ready.png");

const ParagraphComplete = styled.p`
  font-weight: 500;
  font-size: 15px;
  line-height: 26px;
  color: #0068ea;
  font-size: 15px;
`;

const ParagraphHandleHeader = styled.p`
  font-weight: 500;
  font-size: 15px;
  line-height: 26px;
  color: #0068ea;
  font-size: 15px;
`;

const ParagraphOysterhandle = styled.p`
  font-weight: 500;
  font-size: 15px;
  line-height: 26px;
  color: #778291;
  font-size: 15px;
`;

const Span = styled.span`
  color: #afcbfe;
  font-size: 20px;
  font-weight: 500;
`;

const UploadCompleteSlide = ({ handle }) => (
  <Slide title="Upload Complete" image={ICON_READY}>
    <ParagraphComplete>
      Your file has been successfully uploaded to the Tangle. An Oyster handle
      has been generated below. This handle is the only way to access your file
      on the Tangle. Please store this handle in a safe place.
    </ParagraphComplete>
    <div>
      <ParagraphHandleHeader>
        <Span>Oyster Handle:</Span>
      </ParagraphHandleHeader>
      <ParagraphOysterhandle id="oyster-handle">
        {handle}
      </ParagraphOysterhandle>
      <ClipboardBtn text={handle}>Copy to clipboard</ClipboardBtn>
    </div>
  </Slide>
);

export default UploadCompleteSlide;
