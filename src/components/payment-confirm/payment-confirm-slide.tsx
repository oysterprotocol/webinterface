import React from "react";
import styled from "styled-components";

import Slide from "../shared/slide";

const ICON_READY = require("../../assets/images/icon_ready.png");
const ICON_SPINNER = require("../../assets/images/icon_spinner.png");


const Paragraph = styled.p`
  color: #778291;
  font-weight: 500;
  font-size: 15px;
  line-height: 26px;
`;

const PaymentConfirmSpinnerImage = styled.img`
  margin: 75px auto 0 auto;
  display: block;
  animation: spin 2s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const PaymentConfirmSlide = () => (
  <Slide title="Transaction Received" image={ICON_READY}>
    <Paragraph>
      Your transaction has been received, and is now being confirmed on the
      Ethereum Blockchain.
    </Paragraph>
    <PaymentConfirmSpinnerImage src={ICON_SPINNER} />
  </Slide>
);

export default PaymentConfirmSlide;
