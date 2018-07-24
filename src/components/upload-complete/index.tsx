import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { FEAT_FLAG } from "../../config";
import UploadCompleteSlide from "./upload-complete-slide";
import { getSortedHistoryDesc } from "../../redux/selectors/upload-history-selector";

const mapStateToProps = state => ({
  history: state.upload.history,
  historyDesc: getSortedHistoryDesc(state)
});
const mapDispatchToProps = dispatch => ({});

const UploadComplete = ({ history, historyDesc }) => {
  const uploadedFile = FEAT_FLAG.STREAMING_UPLOAD
    ? historyDesc[0]
    : _.last(history);
  const handle = uploadedFile ? uploadedFile.handle : "";
  return <UploadCompleteSlide handle={handle} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadComplete);