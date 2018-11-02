import React from "react";
import styled from "styled-components";

const ButtonFocus = styled.button`
  :focus {
    outline: 0;
  }
`;

const Button = props => {
  const { children, onClick, disabled, className } = props;
  return (
    <ButtonFocus
      {...props}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </ButtonFocus>
  );
};

export default Button;
