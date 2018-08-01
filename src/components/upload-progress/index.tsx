import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

import UploadProgressSlide from "./upload-progress-slide";
import { getSortedHistoryDesc } from "../../redux/selectors/upload-history-selector";
import { FEAT_FLAG } from "../../config";

const mapStateToProps = state => ({
  upload: state.upload,
  history: state.upload.history,
  historyDesc: getSortedHistoryDesc(state)
});
const mapDispatchToProps = dispatch => ({});

interface UploadProgressProps {
  upload: any;
  history: any;
  historyDesc: any[];
}

interface UploadProgressState {}

class UploadProgress extends React.Component<
  UploadProgressProps,
  UploadProgressState
> {
  componentDidMount() {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx fire action here");
  }

  render() {
    const { history, historyDesc, upload } = this.props;
    const uploadedFile = FEAT_FLAG.STREAMING_UPLOAD
      ? historyDesc[0] // This might not be needed.
      : _.last(history);

    const uploadProgress = FEAT_FLAG.STREAMING_UPLOAD
      ? upload.uploadProgress
      : (uploadedFile && uploadedFile.uploadProgress) || 0;

    return <UploadProgressSlide uploadProgress={uploadProgress} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadProgress);
