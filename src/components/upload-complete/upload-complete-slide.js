import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Slide from "components/shared/slide";
import PrimaryButton from "components/shared/primary-button";
import ICON_READY from "assets/images/icon_ready.png";

const UploadCompleteSlide = ({ handle }) => (
  <Slide title="Upload Complete" image={ICON_READY}>
    <p className="complete-instructions">
      Your file has been successfully uploaded to the Tangle. An Oyster handle
      has been generated below. This handle is the only way to access your file
      on the Tangle. Please store this handle in a safe place.
    </p>
    <div>
      <p>
        <span className="handle-header">Oyster Handle:</span>
        <CopyToClipboard text={handle}>
          <button className="clipboard-button">Copy to clipboard</button>
        </CopyToClipboard>
      </p>
      <p className="oyster-handle">{handle}</p>
    </div>
  </Slide>
);

export default UploadCompleteSlide;
