import React from "react";
import SlideContainer from "../shared/slide";
import Button from "../shared/button";
import styled from "styled-components";

const Paragraph = styled.p`
  color: #778291;
  font-weight: 500;
  font-size: 15px;
  line-height: 26px;
`;

const DownloadCompleteSlide = () => (
  <SlideContainer title="Your download is ready">
    <div>
      <Paragraph>Click the button below to begin downloading your file.</Paragraph>
      <Button className="btn btn-default">DOWNLOAD</Button>
    </div>
  </SlideContainer>
);

export default DownloadCompleteSlide;
