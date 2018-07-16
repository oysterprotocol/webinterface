import React from "react";
import SlideContainer from "../shared/slide";

const DownloadCompleteSlide = () => (
  <SlideContainer title="Your download is ready">
    <div>
      <p>Click the button below to begin downloading your file.</p>
      <button className="btn btn-default">DOWNLOAD</button>
    </div>
  </SlideContainer>
);

export default DownloadCompleteSlide;
