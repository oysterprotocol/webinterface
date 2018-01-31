import React from "react";
import { connect } from "react-redux";

import DownloadCompleteSlide from "components/download-complete/download-complete-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

const DownloadComplete = ({}) => <DownloadCompleteSlide />;

export default connect(mapStateToProps, mapDispatchToProps)(DownloadComplete);
