import React from "react";

import Slide from "../shared/slide"

const ICON_READY = require("../../assets/images/icon_ready.png");
const ICON_SPINNER = require("../../assets/images/icon_spinner.png");

const PaymentConfirmSlide = () => (
  <Slide title="Transaction Received" image={ICON_READY}>
    <p>
      Your transaction has been received, and is now being confirmed on the
      Ethereum Blockchain.
    </p>
    <img src={ICON_SPINNER} className="payment-confirm-spinner spin-2s" />
  </Slide>
);

export default PaymentConfirmSlide;
