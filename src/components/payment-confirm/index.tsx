import React from "react";
import { connect } from "react-redux";

import PaymentConfirmSlide from "./payment-confirm-slide";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

const PaymentConfirm = () => {
  return <PaymentConfirmSlide />;
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentConfirm);
