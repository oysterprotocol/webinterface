import React from "react";

import Slide from "components/shared/slide";
import ICON_READY from "assets/images/icon_ready.png";
import ICON_SPINNER from "assets/images/icon_spinner.png";

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
