import React, { Component } from "react";
import styled from "styled-components";

import Slide from "../shared/slide";

const ICON_PlANE = require("../../assets/images/sendAirplane.svg");

interface PaymentInvoiceSlideProps {
  cost;
  ethAddress;
  gasPrice;
}

const PaymentRequestParagraph = styled.p`
  font-size: 15px;
  line-height: 26px;
  margin-top: 50px;
  color: gray;
  font-weight: bold;
`;

const PaymentRequestSpan = styled.span`
  color: #0068ea;
`;

class PaymentInvoiceSlide extends Component<PaymentInvoiceSlideProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { cost, ethAddress, gasPrice } = this.props;
    return (
      <Slide title="Send PRL (Paid for by Oyster)" image={ICON_PlANE}>
        <div>
          To complete this transaction, send <span>{cost} PRL</span> to the
          address listed below:
          <br />
          <br />
          <br />
          <PaymentRequestSpan>{ethAddress}</PaymentRequestSpan>
          <PaymentRequestParagraph>
            We suggest using at least {gasPrice} Gwei for a gas price and 55,000
            gas limit to ensure the transaction is confirmed as quickly as
            possible.
          </PaymentRequestParagraph>
        </div>
      </Slide>
    );
  }
}

export default PaymentInvoiceSlide;
