import React from "react";

import Slide from "components/shared/slide";
import PrimaryButton from "components/shared/primary-button";
import ICON_TANGLE_LEFT from "assets/images/icon_tangle_left.png";
import ICON_TANGLE_RIGHT from "assets/images/icon_tangle_right.png";
import ICON_UPLOAD from "assets/images/icon_upload.png";
import ICON_DOWNLOAD from "assets/images/icon_download.png";

const RetrieveFileSlide = () => (
  <Slide title="Retrieve a File">
    <p>
      Enter your Oyster handle below to access your stored file from the Tangle.
    </p>
    <div>
      Oyster Handle:
      <input type="text" />
    </div>
    <div>
      <PrimaryButton>Retrieve File</PrimaryButton>
    </div>
  </Slide>
);

export default RetrieveFileSlide;
