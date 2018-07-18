import React from "react";
import { connect } from "react-redux";

import { FEAT_FLAG } from "../../config";
import downloadActions from "../../redux/actions/download-actions";
import DownloadFormSlide from "./download-form-slide";

const mapStateToProps = state => ({
  status: state.download.status
});
const mapDispatchToProps = dispatch => ({
  initializeDownloadFn: handle =>
    dispatch(
      FEAT_FLAG.STREAMING_DOWNLOAD
        ? downloadActions.streamDownload({ handle })
        : downloadActions.initializeDownloadAction(handle)
    )
});

const DownloadForm = ({ initializeDownloadFn, status }) => (
  <DownloadFormSlide download={initializeDownloadFn} status={status} />
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadForm);
