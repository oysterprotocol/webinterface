import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router";
import queryString from "query-string";

import UploadProgressSlide from "./upload-progress-slide";
import { getSortedHistoryDesc } from "../../redux/selectors/upload-history-selector";
import { FEAT_FLAG } from "../../config";

const mapStateToProps = state => ({
  upload: state.upload,
  uploadHistory: state.upload.history,
  historyDesc: getSortedHistoryDesc(state)
});
const mapDispatchToProps = dispatch => ({});

interface UploadProgressProps {
  upload: any;
  uploadHistory: any;
  historyDesc: any[];
  location: any;
}

interface UploadProgressState {}

class UploadProgress extends React.Component<
  UploadProgressProps,
  UploadProgressState
> {
  componentDidMount() {
    const { location } = this.props;
    const query = queryString.parse(location.search);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx fire action here", query);
  }

  render() {
    const { uploadHistory, historyDesc, upload } = this.props;
    const uploadedFile = FEAT_FLAG.STREAMING_UPLOAD
      ? historyDesc[0] // This might not be needed.
      : _.last(uploadHistory);

    const uploadProgress = FEAT_FLAG.STREAMING_UPLOAD
      ? upload.uploadProgress
      : (uploadedFile && uploadedFile.uploadProgress) || 0;

    return <UploadProgressSlide uploadProgress={uploadProgress} />;
  }
}

<<<<<<< HEAD:src/components/upload-progress/index.tsx
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadProgress);
=======
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UploadStarted)
);
>>>>>>> support for query string:src/components/upload-started/index.tsx
