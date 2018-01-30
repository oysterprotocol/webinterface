import React from "react";
import ICON_TANGLE_UP from "assets/images/icon_tangle_up.png";
import ICON_DOWNLOAD from "assets/images/icon_download.png";

const Slide = ({ children, title }) => {
  return (
    <section className="slide">
      <div className="container bordered indented-container">
        <div className="slide-body">
          <h1 className="slide-title">{title}</h1>
          <hr className="title-underline" align="left" />
          {children}
        </div>
        <div className="slide-image-wrapper">
          <div class="slide-custom-image">
            <img src={ICON_DOWNLOAD} className="slide-icon" />
          </div>
          <div>
            <img src={ICON_TANGLE_UP} className="slide-tangle-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Slide;
