import React, { Component } from "react";

class DownloadUploadHistoryButton extends Component {
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
