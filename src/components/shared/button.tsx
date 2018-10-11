import React from "react";

const Button = props => {
  const { children, onClick, disabled, className } = props;
  return (
    <button
      {...props}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
