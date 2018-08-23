import React from "react";
import { connect } from "react-redux";

import UploadCompleteSlide from "./upload-complete-slide";
import { getSortedHistoryDesc } from "../../redux/selectors/upload-history-selector";

const mapStateToProps = state => ({
  history: state.upload.history,
  historyDesc: getSortedHistoryDesc(state)
});
const mapDispatchToProps = dispatch => ({});

const UploadComplete = ({ history, historyDesc }) => {
  const uploadedFile = historyDesc[0];
  const handle = uploadedFile ? uploadedFile.handle : "";
  return <UploadCompleteSlide handle={handle} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadComplete);
