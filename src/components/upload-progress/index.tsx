import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import queryString from "query-string";
import { streamUploadProgress } from "../../services/oyster-stream";

import UploadProgressSlide from "./upload-progress-slide";
import { getSortedHistoryDesc } from "../../redux/selectors/upload-history-selector";

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
  UploadProgressState> {
  componentDidMount() {
    const { location } = this.props;
    const query = queryString.parse(location.search);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx fire action here", query);

    if (query.handle) {
      streamUploadProgress(query.handle, {
        uploadProgressCb: (res) => {
          console.log('Progress Callback: ',res)
        },
        doneCb: (res) => {
          console.log('Done Callback: ',res)
        },
        errCb: (res) => {
          console.log('Error Callback: ',res)
        }
      })
    }
  }

  render() {
    const { upload } = this.props;
    const uploadProgress = upload.uploadProgress;

    return <UploadProgressSlide uploadProgress={uploadProgress} />;
  }
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UploadProgress)
);
