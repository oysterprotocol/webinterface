import React from "react";

import Slide from "components/shared/slide";
import ICON_SPINNER from "assets/images/icon_spinner.png";
import ICON_DOWNLOAD from "assets/images/icon_download.png";

const DownloadStartedSlide = () => (
  <Slide title="Retrieving file..." image={ICON_DOWNLOAD}>
    <p className="retrieval-instructions">
      Your file is being retrieved from the Tangle.
    </p>
    <div className="spinner-wrapper">
      <img src={ICON_SPINNER} className="spinner" alt="spinner" />
    </div>
  </Slide>
);

export default DownloadStartedSlide;
