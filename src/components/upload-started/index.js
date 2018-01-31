import React from "react";
import { connect } from "react-redux";

import UploadStartedSlide from "components/upload-started/upload-started-slide";

const mapStateToProps = state => ({
  history: state.upload.history
});
const mapDispatchToProps = dispatch => ({});

const UploadStarted = ({ history }) => {
  const uploadedFile = history[0];
  const uploadProgress = uploadedFile ? uploadedFile.uploadProgress : 0;
  return <UploadStartedSlide uploadProgress={uploadProgress} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadStarted);
