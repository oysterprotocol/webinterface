import React from "react";

const Slide = ({ children }) => {
  return (
    <section className="slide">
      <div className="container">{children}</div>
    </section>
  );
};

export default Slide;
