import React from "react";

const SlideError = ({ children, title, image }) => {
    return (
        <section className="slide">
        <div className="container bordered indented-container">
        <div className="slide-body slide-error-body">
        <h1 className="slide-title">{title}</h1>
        <hr align="left" className="underline" />
        {children}
        </div>
        </div>
        </section>
);
};

export default SlideError;
