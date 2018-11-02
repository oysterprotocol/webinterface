import React from "react";
import styled from "styled-components";

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

const UploadStartedSlide = ({ chunksProgress }) => {
  // TODO: Listen to meta attached state?
  const waitingForMeta = chunksProgress >= 99.999; // epsilon b/c float comparison.

  return (
    <Slide title="Upload Started" image={ICON_UPLOAD}>
      <ParagraphInstructions >
        <strong>Please do not close this tab.</strong>
      </ParagraphInstructions>
      <ParagraphInstructions>
        File is being broken into chunks and each chunk encrypted.
        <Spinner isActive={true} className="download-spinner" />
      </ParagraphInstructions>

      <ParagraphInstructions>
        <span>
          Uploading chunks to brokers
          {waitingForMeta ? "" : "..."}
        </span>
        <br />
        <span style={waitingForMeta ? {} : { display: "none" }}>
          Confirming upload on the tangle...
        </span>
      </ParagraphInstructions>

      <div>
        <ProgressBar progress={chunksProgress} />
        <Paragraph>{Math.floor(Math.min(100, chunksProgress))}%</Paragraph>
      </div>
    </Slide>
  );
};

export default UploadStartedSlide;
