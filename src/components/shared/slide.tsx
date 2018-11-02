import React from "react";
import styled from "styled-components";

const ICON_TANGLE_UP = require("../../assets/images/icon_tangle_up.png");

const SlideTitle = styled.h1`
  color: #0068ea;
  font-weight: 600;
  font-size: 32px;
`;

const Hr = styled.hr`
  margin-bottom: 2rem;
  width: 50px;
  border-color: #afcbfe;
  border-width: 5px;
  margin-left: 0px;
  margin-top: 15px;
`;

const Slide = ({ children, title, image }: any) => {
  return (
    <section className="slide">
      <div className="container bordered indented-container">
        <div className="slide-body">
          <SlideTitle>{title}</SlideTitle>
          <Hr />
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
