import React from "react";
import { connect } from "react-redux";

import UploadStartedSlide from "components/upload-started/upload-started-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

const UploadStarted = ({ initializeUploadFn }) => <UploadStartedSlide />;

export default connect(mapStateToProps, mapDispatchToProps)(UploadStarted);
