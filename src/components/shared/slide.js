import React from "react";

const SlideContainer = ({ children, title }) => {
  return (
    <section className="slide">
      <div className="container">
        <h1 className="slide-title">{title}</h1>
        {children}
      </div>
    </section>
  );
};

export default SlideContainer;
