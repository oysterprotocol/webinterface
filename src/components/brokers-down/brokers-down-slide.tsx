import React from "react";
import styled from "styled-components";

import SlideError from "../shared/slide-error";

const BROKERS_DOWN = require("../../assets/images/icon_brokers_down.png");

const BrokersDownImage = styled.img`
  display: block;
  float: right;
  margin: 0 0 0 0;
  @media (max-width: 767px) {
    float: none;
    margin: 60px auto 0 auto;
    width: 60%;
  }
  @media (min-width: 768px) and (max-width: 991px) {
    float: none;
    margin: 0 auto;
    width: 60%;
  }
`;

const BrokersDownParagraph = styled.p`
  margin: 80px 0 0 0;
  max-width: 450px;
  font-size: 20px;
  @media (max-width: 767px) {
    margin: 60px 0 0 0;
    font-size: 15px;
  }
  @media (min-width: 768px) and (max-width: 991px) {
    margin: 80px 0 0 0;
  }
`;

const BrokersDownLinkSpan = styled.span``;

const BrokersDownLinkText = styled.a`
  font-weight: bold;
  color: #0068ea !important;
  text-decoration: none;
  ${BrokersDownLinkSpan}:hover & {
  text-decoration: none;
  color: #0068ea !important;
  }`;

class BrokersDownSlide extends React.Component {
    render() {
        return (
    <SlideError title="Broker Nodes Offline" image={null}>
        <BrokersDownImage
            src={BROKERS_DOWN}
            alt="brokers-down"/>
        <BrokersDownParagraph>
            Oyster Storage’s broker nodes are currently offline.
            Uploads are unavailable at this time.
            <br/>
            <br/>
            Please visit our{" "}
            <BrokersDownLinkSpan><BrokersDownLinkText href="https://t.me/oysterprotocol">
                Telegram Channel</BrokersDownLinkText></BrokersDownLinkSpan>
            {" "}for more information. We apologize for the inconvenience.
        </BrokersDownParagraph>
    </SlideError>
)}}

export default BrokersDownSlide;