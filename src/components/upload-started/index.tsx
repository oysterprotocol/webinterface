import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import UploadStartedSlide from "./upload-started-slide";

const mapStateToProps = state => ({
  upload: state.upload
});
const mapDispatchToProps = dispatch => ({});

interface UploadProgressProps {
  upload: any;
}

interface UploadProgressState {}

class UploadProgress extends React.Component<
  UploadProgressProps,
  UploadProgressState
> {
  render() {
    const { upload } = this.props;
    const { chunksProgress } = upload;

    return <UploadStartedSlide chunksProgress={chunksProgress} />;
  }
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UploadProgress)
);
