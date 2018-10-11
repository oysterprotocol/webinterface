import React from "react";

import Button from "../shared/button";

const ICON_TANGLE_LEFT = require("../../assets/images/icon_tangle_left.png");
const ICON_TANGLE_RIGHT = require("../../assets/images/icon_tangle_right.png");
const ICON_UPLOAD = require("../../assets/images/icon_upload.png");
const ICON_DOWNLOAD = require("../../assets/images/icon_download.png");

const ChoiceSlide = ({ visitUploadFormFn, visitDownloadFormFn }) => (
  <section className="slide">
    <div className="container choice-wrapper">
      <div className="choice-section">
        <img src={ICON_TANGLE_LEFT} className="tangle-image" alt="tangle" />
        <div>
          <img src={ICON_UPLOAD} className="upload-image" alt="upload" />
        </div>
        <div>
          <Button id="upload-btn" className="primary-button" onClick={visitUploadFormFn}>
            Upload a File
          </Button>
        </div>
        <p className="instructions">Use Oyster to host a file on the Tangle.</p>
      </div>
      <div className="choice-section">
        <img src={ICON_TANGLE_RIGHT} className="tangle-image" alt="tangle" />
        <div>
          <img src={ICON_DOWNLOAD} className="upload-image" alt="download" />
        </div>
        <div>
          <Button id="download-btn" className="primary-button" onClick={visitDownloadFormFn}>
            Retrieve a File
          </Button>
        </div>
        <p className="instructions">
          Use an Oyster handle to retrieve a file from the Tangle.
        </p>
      </div>
    </div>
  </section>
);

export default ChoiceSlide;
