import React from "react";
import { connect } from "react-redux";

import downloadActions from "redux/actions/download-actions";
import DownloadFormSlide from "components/download-form/download-form-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  initializeDownloadFn: handle =>
    dispatch(downloadActions.initializeDownloadAction(handle))
});

const DownloadForm = ({ initializeDownloadFn }) => (
  <DownloadFormSlide download={initializeDownloadFn} />
);

export default connect(mapStateToProps, mapDispatchToProps)(DownloadForm);
