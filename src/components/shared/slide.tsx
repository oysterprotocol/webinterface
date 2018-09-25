import React from "react";

const ICON_TANGLE_UP = require("../../assets/images/icon_tangle_up.png");

const Slide = ({ children, title, image }: any) => {
  return (
    <section className="slide">
      <div className="container bordered indented-container">
        <div className="slide-body">
          <h1 className="slide-title">{title}</h1>
          <hr className="underline" />
          {children}
        </div>
        <div className="slide-image-wrapper">
          <div className="slide-custom-image">
            <img src={image} className="slide-icon" alt="tangle icon" />
          </div>
          <div>
            <img
              src={ICON_TANGLE_UP}
              className="slide-tangle-image"
              alt="tangle background"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Slide;
