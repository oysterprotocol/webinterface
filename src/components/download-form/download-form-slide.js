import React from "react";

import Slide from "components/shared/slide";
import PrimaryButton from "components/shared/primary-button";
import ICON_DOWNLOAD from "assets/images/icon_download.png";

const DownloadFormSlide = () => (
  <Slide title="Retrieve a File" image={ICON_DOWNLOAD}>
    <p className="handle-instructions">
      Enter your Oyster handle below to access your stored file from the Tangle.
    </p>
    <div>
      <label>
        <span className="handle-label">Oyster Handle:</span>
        <input name="handle" type="text" />
      </label>
    </div>
    <div>
      <PrimaryButton>Retrieve File</PrimaryButton>
    </div>
  </Slide>
);

export default DownloadFormSlide;
