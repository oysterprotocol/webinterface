import React from "react";
import { connect } from "react-redux";

import UploadCompleteSlide from "components/upload-complete/upload-complete-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

const UploadComplete = ({ initializeUploadFn }) => <UploadCompleteSlide />;

export default connect(mapStateToProps, mapDispatchToProps)(UploadComplete);
