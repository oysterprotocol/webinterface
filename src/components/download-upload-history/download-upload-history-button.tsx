import React, { Component } from "react";

interface IDownloadUploadHistoryButton {
    download
}

class DownloadUploadHistoryButton extends Component<IDownloadUploadHistoryButton> {
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
