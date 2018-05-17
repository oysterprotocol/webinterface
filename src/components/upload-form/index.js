import React from "react";
import { connect } from "react-redux";

import uploadActions from "redux/actions/upload-actions";
import UploadSlide from "components/upload-form/upload-slide";

const mapStateToProps = state => ({
  alphaBroker: state.upload.alphaBroker,
  betaBroker: state.upload.betaBroker,
  retentionYears: state.upload.retentionYears
});
const mapDispatchToProps = dispatch => ({
  selectAlphaBrokerFn: url =>
    dispatch(uploadActions.selectAlphaBrokerAction(url)),
  selectBetaBrokerFn: url =>
    dispatch(uploadActions.selectBetaBrokerAction(url)),
  initializeUploadFn: (file, retentionYears) =>
    dispatch(uploadActions.initializeUploadAction({ file, retentionYears })),
  selectRetentionYears: value =>
    dispatch(uploadActions.selectRetentionYears(value))
});

const UploadForm = ({
  initializeUploadFn,
  selectAlphaBrokerFn,
  selectBetaBrokerFn,
  alphaBroker,
  betaBroker,
  retentionYears,
  selectRetentionYears
}) => (
  <UploadSlide
    upload={initializeUploadFn}
    selectAlphaBroker={selectAlphaBrokerFn}
    selectBetaBroker={selectBetaBrokerFn}
    alphaBroker={alphaBroker}
    betaBroker={betaBroker}
    retentionYears={retentionYears}
    selectRetentionYears={selectRetentionYears}
  />
);

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm);
