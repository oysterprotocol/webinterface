import React from "react";
import { connect } from "react-redux";

import PaymentInvoiceSlide from "components/payment-invoice/payment-invoice-slide";

const mapStateToProps = state => ({
  cost: state.upload.invoice.cost,
  ethAddress: state.upload.invoice.ethAddress
});
const mapDispatchToProps = dispatch => ({});

const PaymentInvoice = ({ cost, ethAddress }) => (
  <PaymentInvoiceSlide cost={cost} ethAddress={ethAddress} />
);

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInvoice);
