import React from "react";
import { connect } from "react-redux";

import uploadActions from "../../redux/actions/upload-actions";
import UploadSlide from "./upload-slide";

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
  selectRetentionYears: value =>
    dispatch(uploadActions.selectRetentionYears(value)),
  streamUploadFn: (file, retentionYears, brokers) =>
    dispatch(uploadActions.streamUpload({ file, retentionYears, brokers }))
});

const UploadForm = ({
  initializeUploadFn,
  selectAlphaBrokerFn,
  selectBetaBrokerFn,
  streamUploadFn,
  alphaBroker,
  betaBroker,
  retentionYears,
  selectRetentionYears
}) => (
  <UploadSlide
    streamUploadFn={streamUploadFn}
    selectAlphaBroker={selectAlphaBrokerFn}
    selectBetaBroker={selectBetaBrokerFn}
    alphaBroker={alphaBroker}
    betaBroker={betaBroker}
    retentionYears={retentionYears}
    selectRetentionYears={selectRetentionYears}
  />
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadForm);
