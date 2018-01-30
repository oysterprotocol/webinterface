import React from "react";
import { connect } from "react-redux";

import ChoiceSlide from "components/path-choice/choice-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

const PathChoice = ({ initializeUploadFn }) => <ChoiceSlide />;

export default connect(mapStateToProps, mapDispatchToProps)(PathChoice);
