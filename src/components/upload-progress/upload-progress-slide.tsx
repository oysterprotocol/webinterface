import React from "react";

import ProgressBar from "../shared/progress-bar";
import Slide from "../shared/slide";
import Spinner from "../shared/spinner";

const ICON_UPLOAD = require("../../assets/images/icon_upload.png");

const UploadProgressSlide = ({ uploadProgress }) => (
  <Slide title="Upload Progress" image={ICON_UPLOAD}>
    <p className="transaction-confirmed-instructions">
      Transaction Confirmed. Your file is now being uploaded to the Tangle...
      <Spinner isActive={uploadProgress === 0} className="download-spinner" />
    </p>
    <p>
      You can come and check your progress at{" "}
      <a href={window.location.href}>here</a>
    </p>
    <div>
      <ProgressBar progress={uploadProgress} />
      <p>{Math.floor(Math.min(100, uploadProgress))}%</p>
    </div>
  </Slide>
);

export default UploadProgressSlide;
