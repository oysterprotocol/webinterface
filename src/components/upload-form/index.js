import React from "react";
import { connect } from "react-redux";

import uploadActions from "redux/actions/upload-actions";
import UploadSlide from "components/upload-form/upload-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  selectAlphaBrokerFn: url =>
    dispatch(uploadActions.selectAlphaBrokerAction(url)),
  selectBetaBrokerFn: url =>
    dispatch(uploadActions.selectBetaBrokerAction(url)),
  initializeUploadFn: file =>
    dispatch(uploadActions.initializeUploadAction(file))
});

const UploadForm = ({
  initializeUploadFn,
  selectAlphaBrokerFn,
  selectBetaBrokerFn
}) => (
  <UploadSlide
    upload={initializeUploadFn}
    selectAlphaBroker={selectAlphaBrokerFn}
    selectBetaBroker={selectBetaBrokerFn}
  />
);

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm);
