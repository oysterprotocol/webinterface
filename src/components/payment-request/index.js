import React from "react";
import { connect } from "react-redux";

import PaymentRequestSlide from "components/payment-request/payment-request-slide";

const mapStateToProps = state => ({
  history: state.upload.history,
  cost: state.upload.invoice.cost,
  ethAddress: state.upload.invoice.ethAddress
});
const mapDispatchToProps = dispatch => ({});


const PaymentRequest = ({
  cost,
  ethAddress
}) => (
  <PaymentRequestSlide
  cost={cost}
  ethAddress={ethAddress}
  />
);

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRequest);
