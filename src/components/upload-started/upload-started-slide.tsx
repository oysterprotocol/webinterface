import React from "react";

import ProgressBar from "../shared/progress-bar";
import Slide from "../shared/slide";
import Spinner from "../shared/spinner";

const ICON_UPLOAD = require("../../assets/images/icon_upload.png");

const UploadStartedSlide = ({ chunksProgress }) => {
  // TODO: Listen to meta attached state?
  const waitingForMeta = chunksProgress >= 99.999; // epsilon b/c float comparison.

  return (
    <Slide title="Upload Started" image={ICON_UPLOAD}>
      <p className="transaction-confirmed-instructions">
        <strong>Please do not close this tab.</strong>
      </p>
      <p className="transaction-confirmed-instructions">
        File is being broken into chunks and each chunk encrypted.
        <Spinner isActive={true} className="download-spinner" />
      </p>

      <p className="transaction-confirmed-instructions">
        <span>
          Uploading chunks to brokers
          {waitingForMeta ? "" : "..."}
        </span>
        <br />
        <span style={waitingForMeta ? {} : { display: "none" }}>
          Confirming upload on the tangle...
        </span>
      </p>

      <div>
        <ProgressBar progress={chunksProgress} />
        <p>{Math.floor(Math.min(100, chunksProgress))}%</p>
      </div>
    </Slide>
  );
};

export default UploadStartedSlide;
