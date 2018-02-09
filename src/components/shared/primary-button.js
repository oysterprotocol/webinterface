import React from "react";

const PrimaryButton = ({ children, onClick, disabled }) => (
  <button className="primary-button" onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

export default PrimaryButton;
