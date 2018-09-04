import React from "react";
import { connect } from "react-redux";

import UploadCompleteSlide from "./upload-complete-slide";

const mapStateToProps = state => ({
  handle: state.upload.handle
});

const mapDispatchToProps = dispatch => ({});

const UploadComplete = ({handle}) => {
  return <UploadCompleteSlide handle={handle} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadComplete);
