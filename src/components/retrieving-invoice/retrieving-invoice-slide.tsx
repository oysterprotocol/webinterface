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

const RetrievingInvoiceSpinnerImage = styled.img`
  margin: 75px;
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
  @media (max-width: 767px) {
    margin: 50px auto;
  }
`;

class RetrievingInvoiceSlide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Slide title="Retrieving Invoice..." image={ICON_READY}>
        <Paragraph>We are retrieving your invoice...</Paragraph>
        <RetrievingInvoiceSpinnerImage src={ICON_SPINNER} />
      </Slide>
    );
  }
}

export default RetrievingInvoiceSlide;
