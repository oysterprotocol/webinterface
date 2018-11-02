import React from "react";
import styled from "styled-components";

import Button from "./button";

const ICON_LOGO = require("../../assets/images/logo.svg");

const AppHeader = styled.header`
  background: #0068ea;
  padding: 10px 0;
  -webkit-box-shadow: 0px 5px 20px 0px rgba(50, 50, 50, 0.5);
  -moz-box-shadow: 0px 5px 20px 0px rgba(50, 50, 50, 0.5);
  box-shadow: 0px 5px 20px 0px rgba(50, 50, 50, 0.5);
`;

const AppTitle = styled.span`
  font-size: 18px;
  padding: 0 2rem;
`;

const Header = () => (
  <AppHeader>
    <div role="navigation" className="navbar navbar-default">
      <div className="container">
        <div className="navbar-header">
          <Button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#navbar"
            aria-expanded="false"
            aria-controls="navbar"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </Button>
          <a href="/" className="logo" title="Oyster Storage's Logo">
            <img src={ICON_LOGO} className="header-logo" alt="logo" />
            <AppTitle>Oyster Storage</AppTitle>
          </a>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right">
            <li className="navbar-row first dropdown">
              <a
                href="https://oysterprotocol.com/"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                title="Home"
              >
                Oyster Home
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </AppHeader>
);

export default Header;
