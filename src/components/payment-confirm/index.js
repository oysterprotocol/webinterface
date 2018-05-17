import React from "react";
import { connect } from "react-redux";

import PaymentConfirmSlide from "components/payment-confirm/payment-confirm-slide.js";

const mapStateToProps = state => ({
  history: state.upload.history
});
const mapDispatchToProps = dispatch => ({});

const PaymentConfirm = () => {
  return <PaymentConfirmSlide />;
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentConfirm);
