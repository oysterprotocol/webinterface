import React from "react";
import { connect } from "react-redux";

import DownloadFormSlide from "components/download-form/download-form-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

const DownloadForm = ({ initializeUploadFn }) => <DownloadFormSlide />;

export default connect(mapStateToProps, mapDispatchToProps)(DownloadForm);
