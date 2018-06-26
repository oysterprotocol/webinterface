import React from "react";

const PrimaryButton = props => {
  const { children, onClick, disabled } = props;
  return (
    <button
      {...props}
      className="primary-button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
