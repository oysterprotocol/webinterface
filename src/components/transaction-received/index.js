import React from "react";
import { connect } from "react-redux";

import TransactionReceivedSlide from "components/transaction-received/transaction-received-slide.js";

const mapStateToProps = state => ({
  history: state.upload.history
});
const mapDispatchToProps = dispatch => ({});

const TransactionReceived = () => {
  return <TransactionReceivedSlide/>;
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionReceived);
