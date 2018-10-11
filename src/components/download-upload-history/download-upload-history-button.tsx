import React, { Component } from "react";
import Button from "../shared/button";

interface DownloadUploadHistoryButtonProps {
  download;
}

class DownloadUploadHistoryButton extends Component<
  DownloadUploadHistoryButtonProps
> {
  render() {
    const { download } = this.props;
    return (
      <div>
        <Button
          onClick={() => {
            download();
          }}
        >
          Download upload history
        </Button>
      </div>
    );
  }
}

export default DownloadUploadHistoryButton;
