import React, { Component } from "react";
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

class RetrievingInvoiceSlide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Slide title="Retrieving Invoice..." image={ICON_READY}>
        <Paragraph>We are retrieving your invoice...</Paragraph>
        <img
          src={ICON_SPINNER}
          className="retrieving-invoice-spinner spin-2s"
        />
      </Slide>
    );
  }
}

export default RetrievingInvoiceSlide;
