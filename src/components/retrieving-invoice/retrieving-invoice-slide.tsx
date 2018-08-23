import React, { Component } from "react";

import Slide from "../shared/slide";

const ICON_READY = require("../../assets/images/icon_ready.png");
const ICON_SPINNER = require("../../assets/images/icon_spinner.png");

class RetrievingInvoiceSlide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Slide title="Retrieving Invoice..." image={ICON_READY}>
        <p>We are retrieving your invoice...</p>
        <img
          src={ICON_SPINNER}
          className="retrieving-invoice-spinner spin-2s"
        />
      </Slide>
    );
  }
}

export default RetrievingInvoiceSlide;
