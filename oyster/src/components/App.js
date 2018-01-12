import React, { Component } from "react";

import Logo from "components/shared/Logo";
import "components/App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Logo />
          <h1 className="App-title">Welcome to Oyster</h1>
        </header>
        <button className="App-intro">Upload a file.</button>
      </div>
    );
  }
}

export default App;
