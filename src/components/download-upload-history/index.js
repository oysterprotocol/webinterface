import React, { Component } from "react";
import { connect } from "react-redux";

import downloadUploadHistoryActions from "../../redux/actions/download-upload-history-actions";
import DownloadUploadHistoryButton from "components/download-upload-history/download-upload-history-button";

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  beginDownloadUploadHistoryFn: () =>
    dispatch(downloadUploadHistoryActions.beginDownloadUploadHistoryAction())
});

const DownloadUploadHistory = ({ beginDownloadUploadHistoryFn }) => (
  <DownloadUploadHistoryButton download={beginDownloadUploadHistoryFn} />
);

export default connect(mapStateToProps, mapDispatchToProps)(DownloadUploadHistory);
