import React from "react";
import { connect } from "react-redux";

import downloadActions from "../../redux/actions/download-actions";
import DownloadFormSlide from "./download-form-slide";

const mapStateToProps = state => ({
  status: state.download.status
});
const mapDispatchToProps = dispatch => ({
  initializeDownloadFn: handle =>
    dispatch(downloadActions.streamDownload({ handle }))
});

const DownloadForm = ({ initializeDownloadFn, status }) => (
  <DownloadFormSlide download={initializeDownloadFn} status={status} />
);

export default connect(mapStateToProps, mapDispatchToProps)(DownloadForm);
