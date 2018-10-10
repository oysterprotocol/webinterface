import React from "react";
import styled from "styled-components";

import ClipboardBtn from "../shared/clipboard-button";
import ProgressBar from "../shared/progress-bar";
import Slide from "../shared/slide";
import Spinner from "../shared/spinner";

const ICON_UPLOAD = require("../../assets/images/icon_upload.png");

const TransactionConfirmedInstructions = styled.span`
  padding-bottom: 20px;
`;

const UploadProgressSlide = ({ uploadProgress }) => (
  <Slide title="Upload Progress" image={ICON_UPLOAD}>
    <TransactionConfirmedInstructions>
      Transaction Confirmed. Your file is now being uploaded to the Tangle...
      <Spinner isActive={uploadProgress === 0} className="download-spinner" />
    </TransactionConfirmedInstructions>
    <p>
      You can come back and check your progress using
      <br />
      <a href={window.location.href}>{window.location.href}</a>
    </p>
    <ClipboardBtn text={window.location.href}>Copy URL</ClipboardBtn>
    <div>
      <ProgressBar progress={uploadProgress} />
      <p>{Math.floor(Math.min(100, uploadProgress))}%</p>
    </div>
  </Slide>
);

export default UploadProgressSlide;
