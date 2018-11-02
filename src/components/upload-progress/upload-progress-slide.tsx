import React from "react";
import styled from "styled-components";

import ClipboardBtn from "../shared/clipboard-button";
import ProgressBar from "../shared/progress-bar";
import Slide from "../shared/slide";
import Spinner from "../shared/spinner";

const ICON_UPLOAD = require("../../assets/images/icon_upload.png");

const Paragraph = styled.p`
  color: #778291;
  font-weight: 500;
  font-size: 15px;
  line-height: 26px;
`;

const ParagraphInstructions = styled.p`
  color: #778291;
  font-weight: 500;
  font-size: 15px;
  line-height: 26px;
  padding-bottom: 20px;
`;

const UploadProgressSlide = ({ uploadProgress }) => (
  <Slide title="Upload Progress" image={ICON_UPLOAD}>
    <ParagraphInstructions>
      Transaction Confirmed. Your file is now being uploaded to the Tangle...
      <Spinner isActive={true} className="download-spinner" />
    </ParagraphInstructions>
    <Paragraph>
      You can come back and check your progress using
      <br />
      <a href={window.location.href}>{window.location.href}</a>
    </Paragraph>
    <ClipboardBtn text={window.location.href}>Copy URL</ClipboardBtn>
    <div>
      <ProgressBar progress={uploadProgress} />
      <Paragraph>{Math.floor(Math.min(100, uploadProgress))}%</Paragraph>
    </div>
  </Slide>
);

export default UploadProgressSlide;
