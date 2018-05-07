import React from "react";
import { connect } from "react-redux";

import PaymentRequestSlide from "components/payment-request/payment-request-slide";

const mapStateToProps = state => ({
  history: state.upload.history
});
const mapDispatchToProps = dispatch => ({});

const PaymentRequest = () => {
  return <PaymentRequestSlide/>;
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRequest);
