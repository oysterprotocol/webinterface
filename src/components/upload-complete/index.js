import React from "react";
import { connect } from "react-redux";

import UploadCompleteSlide from "components/upload-complete/upload-complete-slide";

const mapStateToProps = state => ({
  history: state.upload.history
});
const mapDispatchToProps = dispatch => ({});

const UploadComplete = ({ history }) => {
  const uploadedFile = history[0];
  const handle = uploadedFile ? uploadedFile.handle : "";
  return <UploadCompleteSlide handle={handle} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadComplete);
