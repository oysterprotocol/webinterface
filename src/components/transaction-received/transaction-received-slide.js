import React from "react";

import Slide from "components/shared/slide";
import ICON_READY from "assets/images/icon_ready.png";


const TransactionReceivedSlide = () => (
  <Slide title="Transaction Received" image={ICON_READY}>
    <p>Your transaction has bee received, and is now being confirmed on the Ethereum Blockchain.</p>
  </Slide>
);

export default TransactionReceivedSlide;
