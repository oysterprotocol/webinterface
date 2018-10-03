import React from "react";

import ProgressBar from "../shared/progress-bar";
import Slide from "../shared/slide";
import Spinner from "../shared/spinner";

const ICON_UPLOAD = require("../../assets/images/icon_upload.png");

const UploadStartedSlide = ({ chunksProgress }) => {
  const description =
    chunksProgress >= 99.999 // epsilon b/c float comparison.
      ? "Confirming upload..."
      : "File is being broken into chunks and each chunk encrypted...";

  return (
    <Slide title="Upload Started" image={ICON_UPLOAD}>
      <p className="transaction-confirmed-instructions">
        {description}
        <Spinner isActive={chunksProgress === 0} className="download-spinner" />
      </p>
      <p className="transaction-confirmed-instructions">
        Please do not close this tab.
      </p>
      <div>
        <ProgressBar progress={chunksProgress} />
        <p>{Math.floor(Math.min(100, chunksProgress))}%</p>
      </div>
    </Slide>
  );
};

export default UploadStartedSlide;
