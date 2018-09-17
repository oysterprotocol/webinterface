import React from "react";
import { Line } from "rc-progress";

import { UPLOAD_STATE } from "../../redux/reducers/upload-reducer";
import Slide from "../shared/slide";
import Spinner from "../shared/spinner";

const ICON_UPLOAD = require("../../assets/images/icon_upload.png");

const UploadProgressSlide = ({ uploadProgress, uploadState }) => (
  <Slide title="Upload Started" image={ICON_UPLOAD}>
    {uploadState === UPLOAD_STATE.COMPLETE ? (
      <div>
        <strong className="transaction-confirmed-instructions">
          File has been uploaded. You can check on the progress here:
        </strong>
        <br />
        <a href={window.location.href}>{window.location.href}</a>
      </div>
    ) : (
      <strong className="transaction-confirmed-instructions">
        Please do not close this tab while your file is being uploaded.
      </strong>
    )}

    <br />
    <br />
    <p className="transaction-confirmed-instructions">
      Transaction Confirmed. Your file is now being uploaded to the Tangle.
      <Spinner isActive={uploadProgress === 0} className="download-spinner" />
    </p>
    <div>
      <Line
        percent={uploadProgress}
        trailWidth="4"
        strokeWidth="4"
        strokeColor="#4B80FC"
        trailColor="#afcbfe"
        strokeLinecap="square"
        className="upload-progress-bar"
      />
      <p>
        {Math.floor(Math.min(100, uploadProgress))}% - File is being broken into
        chunks and each chunk encrypted…
      </p>
    </div>
  </Slide>
);

export default UploadProgressSlide;
