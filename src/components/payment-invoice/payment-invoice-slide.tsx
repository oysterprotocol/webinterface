import React, { Component } from "react";

import Slide from "../shared/slide";


const ICON_PlANE = require("../../assets/images/sendAirplane.svg");

interface PaymentInvoiceSlideProps {
  cost,
    ethAddress,
    gasPrice
}

class PaymentInvoiceSlide extends Component<PaymentInvoiceSlideProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { cost, ethAddress, gasPrice } = this.props;
    return (
      <Slide title="Send PRL (Paid for by Oyster)" image={ICON_PlANE}>
        <div className="payment-request">
          To complete this transaction, send <span>{cost} PRL</span> to the
          address listed below:
          <br />
          <br />
          <br />
          <span>{ethAddress}</span>
          <p>
            We suggest using at least {gasPrice} Gwei for a gas price and 42,000
            gas limit to ensure the transaction is confirmed as quickly as
            possible.
          </p>
        </div>
      </Slide>
    );
  }
}

export default PaymentInvoiceSlide;
