import React from "react";
import { connect } from "react-redux";

import uploadActions from "redux/actions/upload-actions";
import UploadSlide from "components/upload-form/upload-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  initializeUploadFn: file =>
    dispatch(uploadActions.initializeUploadAction(file))
});

const UploadForm = ({ initializeUploadFn }) => (
  <UploadSlide upload={initializeUploadFn} />
);

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm);
