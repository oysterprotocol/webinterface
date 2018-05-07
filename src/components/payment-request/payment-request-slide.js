import React from "react";

import Slide from "components/shared/slide";
import ICON_PlANE from "assets/images/sendAirplane.svg"; //replace with plane icon

const PaymentRequestSlide = () => (
  <Slide title="Send PRL" image={ICON_PlANE}>
    <div className="payment-request">
      To complete this transaction, send <span>3 PRL</span> to the address listed below:
      <br/>
      <br/>
      <br/>
      <span>s6f7dsg89sdfsdfsdf87sd89f7sd8f7sd98fsd9f</span>
    </div>
  </Slide>
);

export default PaymentRequestSlide;
