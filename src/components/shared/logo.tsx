import React from "react";
import styled from "styled-components";

const logo = require("../../assets/images/icon.png");

const LogoIcon = styled.img`
  max-height: 50px;
`;

const Logo = () => (
  <LogoIcon src={logo} alt="Oyster's icon" />
);

export default Logo;
