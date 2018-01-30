import React from "react";
import { connect } from "react-redux";

import DownloadReadySlide from "components/download-ready/download-ready-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

const DownloadReady = ({}) => <DownloadReadySlide />;

export default connect(mapStateToProps, mapDispatchToProps)(DownloadReady);
