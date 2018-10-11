import React from "react";
import SlideContainer from "../shared/slide";
import Button from "../shared/button";

const DownloadCompleteSlide = () => (
  <SlideContainer title="Your download is ready">
    <div>
      <p>Click the button below to begin downloading your file.</p>
      <Button className="btn btn-default">DOWNLOAD</Button>
    </div>
  </SlideContainer>
);

export default DownloadCompleteSlide;
