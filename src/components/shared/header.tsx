import React from "react";

import Button from "./button";

import "../root.css";

const ICON_LOGO = require("../../assets/images/logo.svg");

const Header = () => (
  <header className="App-header">
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
            <span className="App-title wordmark">Oyster Storage</span>
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
  </header>
);

export default Header;
