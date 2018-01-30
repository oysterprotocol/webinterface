import React from "react";
import { connect } from "react-redux";

import RetrievingSlide from "components/retrieve-in-progress/retrieving-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

const RetrieveInProgress = ({ initializeUploadFn }) => <RetrievingSlide />;

export default connect(mapStateToProps, mapDispatchToProps)(RetrieveInProgress);
