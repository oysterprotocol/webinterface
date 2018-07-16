import React from "react";
import { connect } from "react-redux";

import DownloadStartedSlide from "./download-started-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

const DownloadStarted = ({ initializeUploadFn }) => <DownloadStartedSlide />;

export default connect(mapStateToProps, mapDispatchToProps)(DownloadStarted);
