import React from "react";
import styled from "styled-components";

const ErrorSlide = styled.section`
  @media (min-width: 1200px) {
    margin: 5rem 0;
  }
  @media (max-width: 1199px) and (min-width: 992px) {
    margin: 4rem 0;
  }
  @media (max-width: 991px) and (min-width: 768px) {
    margin: 3rem 0;
  }
  @media (max-width: 767px) {
    margin: 2rem 0;
  }
`;

const ErrorSlideContainer = styled.div`
  flex: 1;
  display: flex;
  padding-bottom: 50px;

  border-left: 2rem solid transparent;
  border-left-color: #0267ea;

  overflow: hidden;
  padding: 50px 0 50px 50px;
  border-right: none;

  border-radius: 1rem;
  -webkit-box-shadow: 0px 0px 20px -3px rgba(50, 50, 50, 0.5);
  -moz-box-shadow: 0px 0px 20px -3px rgba(50, 50, 50, 0.5);
  box-shadow: 0px 0px 20px -3px rgba(50, 50, 50, 0.5);

  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;

  @media (max-width: 767px) {
    flex-direction: column;
    border: 0;
  }
  @media (min-width: 576px) {
    max-width: 540px;
  }
  @media (min-width: 768px) {
    max-width: 720px;
  }
  @media (min-width: 992px) {
    max-width: 960px;
  }
  @media (min-width: 1200px) {
    max-width: 1140px;
  }
`;

const ErrorSlideBody = styled.div`
  flex: 1;
  padding: 50px;
  @media (min-width: 320px) and (max-width: 478px) {
    flex: 1;
  }
  @media (max-width: 767px) {
    padding-top: 25px;
  }
`;

const ErrorSlideTitle = styled.h1`
  color: #0068ea;
`;

const ErrorSlideUnderline = styled.hr`
  width: 50px;
  border-color: #afcbfe;
  border-width: 5px;
  float: left;
`;

const SlideError = ({ children, title, image }) => {
  return (
    <ErrorSlide>
      <ErrorSlideContainer>
        <ErrorSlideBody>
          <ErrorSlideTitle>{title}</ErrorSlideTitle>
          <ErrorSlideUnderline />
          {children}
        </ErrorSlideBody>
      </ErrorSlideContainer>
    </ErrorSlide>
  );
};

export default SlideError;
