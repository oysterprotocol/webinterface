import React from "react";
import { connect } from "react-redux";

import RetrieveFileSlide from "components/retrieve-file/retrieve-file-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

const RetrieveFile = ({ initializeUploadFn }) => <RetrieveFileSlide />;

export default connect(mapStateToProps, mapDispatchToProps)(RetrieveFile);
