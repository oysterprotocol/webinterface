import React from "react";
import { connect } from "react-redux";

import ChoiceSlide from "components/path-choice/choice-slide";
import navigationActions from "redux/actions/navigation-actions";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  visitUploadFormFn: () => dispatch(navigationActions.visitUploadFormAction())
});

const PathChoice = ({ visitUploadFormFn }) => (
  <ChoiceSlide visitUploadFormFn={visitUploadFormFn} />
);

export default connect(mapStateToProps, mapDispatchToProps)(PathChoice);
