import React from "react";
import styled from "styled-components";

import Button from "../shared/button";

const ICON_TANGLE_LEFT = require("../../assets/images/icon_tangle_left.png");
const ICON_TANGLE_RIGHT = require("../../assets/images/icon_tangle_right.png");
const ICON_UPLOAD = require("../../assets/images/icon_upload.png");
const ICON_DOWNLOAD = require("../../assets/images/icon_download.png");

const Paragraph = styled.p`
  color: #778291;
  font-weight: 500;
  font-size: 15px;
  line-height: 26px;
  margin-top: 20px;
`;

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
        <Paragraph>Use Oyster to host a file on the Tangle.</Paragraph>
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
        <Paragraph>
          Use an Oyster handle to retrieve a file from the Tangle.
        </Paragraph>
      </div>
    </div>
  </section>
);

export default ChoiceSlide;
