import React from "react";
import { connect } from "react-redux";
import last from "lodash/last";

import ErrorPageSlide from "../error-page/error-page-slide";

const mapStateToProps = state => ({
  history: state.upload.history
});
const mapDispatchToProps = dispatch => ({});

const ErrorPage = ({ history }) => {
  const uploadedFile: any = last(history);
  const handle = uploadedFile ? uploadedFile.handle : "";
  return <ErrorPageSlide handle={handle} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
