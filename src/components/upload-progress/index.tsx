import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import queryString from "query-string";
import { streamUploadProgress } from "../../services/oyster-stream";

import UploadProgressSlide from "./upload-progress-slide";
import { getSortedHistoryDesc } from "../../redux/selectors/upload-history-selector";
import uploadActions from "../../redux/actions/upload-actions";

const mapStateToProps = state => ({
  upload: state.upload,
  uploadHistory: state.upload.history,
  historyDesc: getSortedHistoryDesc(state)
});
const mapDispatchToProps = dispatch => ({
    streamUploadProgressFn: progress =>
        dispatch(uploadActions.streamUploadProgress({progress})),
    streamUploadSuccessFn: handle =>
        dispatch(uploadActions.streamUploadSuccess({handle}))
});

interface UploadProgressProps {
  upload: any;
  uploadHistory: any;
  historyDesc: any[];
  location: any;
  streamUploadProgressFn: any;
  streamUploadSuccessFn: any;
}

interface UploadProgressState {}

class UploadProgress extends React.Component<
  UploadProgressProps,
  UploadProgressState> {

  componentDidMount() {
    const { location, streamUploadProgressFn, streamUploadSuccessFn } = this.props;
    const query = queryString.parse(location.search);

    if (query.handle) {
      streamUploadProgress(query.handle, {
        uploadProgressCb: (res) => {
            const progress = res.progress;
            streamUploadProgressFn(progress)
        },
        doneCb: (res) => {
            const handle = res.handle;
            streamUploadSuccessFn(handle)
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
