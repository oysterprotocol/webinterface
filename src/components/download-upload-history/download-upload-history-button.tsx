import React, { Component } from "react";

interface DownloadUploadHistoryButtonProps {
    download
}

class DownloadUploadHistoryButton extends Component<DownloadUploadHistoryButtonProps> {
  render() {
    const { download } = this.props;
    return (
      <div>
        <button
          onClick={() => {
            download();
          }}
        >
          Download upload history
        </button>
      </div>
    );
  }
}

export default DownloadUploadHistoryButton;
