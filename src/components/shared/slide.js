import React from "react";

const Slide = ({ children }) => {
  return (
    <section>
      <div className="container">{children}</div>
    </section>
  );
};

export default Slide;
