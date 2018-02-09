import React, { Component } from "react";

import { DOWNLOAD_STATUSES } from "config";
import Slide from "components/shared/slide";
import PrimaryButton from "components/shared/primary-button";
import Spinner from "components/shared/spinner";
import ICON_DOWNLOAD from "assets/images/icon_download.png";

class DownloadFormSlide extends Component {
  render() {
    const { download, status } = this.props;
    return (
      <Slide title="Retrieve a File" image={ICON_DOWNLOAD}>
        <p className="handle-instructions">
          Enter your Oyster handle below to access your stored file from the
          Tangle.
        </p>
        <div>
          <label>
            <span className="handle-label">Oyster Handle:</span>
            <input
              name="handle"
              type="text"
              ref="handleInput"
              className="handle-text-input"
            />
          </label>
        </div>
        <div>
          <PrimaryButton
            disabled={status === DOWNLOAD_STATUSES.PENDING}
            onClick={() => {
              const handle = this.refs.handleInput.value;
              if (!handle) {
                alert("Please input a handle.");
              } else {
                download(handle);
              }
            }}
          >
            {status === DOWNLOAD_STATUSES.PENDING
              ? "Retrieving file..."
              : "Retrieve File"}
          </PrimaryButton>
          <Spinner
            isActive={status === DOWNLOAD_STATUSES.PENDING}
            className="download-spinner"
          />
        </div>
      </Slide>
    );
  }
}

export default DownloadFormSlide;
