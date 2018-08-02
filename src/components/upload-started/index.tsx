import React from "react";
import { connect } from "react-redux";

import UploadStartedSlide from "./upload-started-slide";
import { getSortedHistoryDesc } from "../../redux/selectors/upload-history-selector";

const mapStateToProps = state => ({
  upload: state.upload,
  history: state.upload.history,
  historyDesc: getSortedHistoryDesc(state)
});
const mapDispatchToProps = dispatch => ({});

const UploadStarted = ({ history, historyDesc, upload }) => {
  const uploadProgress = upload.uploadProgress;

  return <UploadStartedSlide uploadProgress={uploadProgress} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadStarted);
