import React from "react";

import Slide from "components/shared/slide";
import PrimaryButton from "components/shared/primary-button";
import ICON_UPLOAD from "assets/images/icon_upload.png";

const UploadStartedSlide = ({ uploadProgress }) => (
  <Slide title="Upload Started" image={ICON_UPLOAD}>
    <p className="transaction-confirmed-instructions">
      Transaction Confirmed. Your file is now being uploaded to the Tangle.
    </p>
    <div>
      PROGRESS BAR {uploadProgress}% - File is being broken into chunks and each
      chunk encrypted…
    </div>
  </Slide>
);

export default UploadStartedSlide;
