import React from "react";

import "components/root.css";
import Logo from "../shared/logo";

const Header = () => (
  <header className="App-header">
    <nav role="navigation" className="navbar navbar-default">
        <div className="container-fluid">
            <div className="navbar-header">
				<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span className="sr-only">Toggle navigation</span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
				</button>
            	<a href="" className="logo" title="Oyster Storage's Logo"> 
            		<Logo />
            		<span className="App-title">Oyster Storage</span>
            	</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav navbar-right">
                    <li className="navbar-row first dropdown">
                    	<a href="" role="button" aria-haspopup="true" aria-expanded="false" title="Home">Oyster Home</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  </header>
);

export default Header;
