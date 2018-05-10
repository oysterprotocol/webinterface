import React, { Component } from "react";

import Slide from "components/shared/slide";
import ICON_PlANE from "assets/images/sendAirplane.svg";


class PaymentRequestSlide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      cost,
      ethAddress
    } = this.props;
    return (
      <Slide title="Send PRL" image={ICON_PlANE}>
        <div className="payment-request">
          To complete this transaction, send <span>{cost} PRL</span> to the address listed below:
          <br/>
          <br/>
          <br/>
          <span>{ethAddress}</span>
        </div>
      </Slide>
    )
  }
}

export default PaymentRequestSlide;
