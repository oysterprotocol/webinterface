import React from "react";
import { connect } from "react-redux";

import ChoiceSlide from "components/path-choice/choice-slide";
import navigationActions from "redux/actions/navigation-actions";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  visitUploadFormFn: () => dispatch(navigationActions.visitUploadFormAction()),
  visitDownloadFormFn: () =>
    dispatch(navigationActions.visitDownloadFormAction())
});

const PathChoice = ({ visitUploadFormFn, visitDownloadFormFn }) => (
  <ChoiceSlide
    visitUploadFormFn={visitUploadFormFn}
    visitDownloadFormFn={visitDownloadFormFn}
  />
);

export default connect(mapStateToProps, mapDispatchToProps)(PathChoice);
