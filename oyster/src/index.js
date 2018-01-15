import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "index.css";

import redux from "./redux";
import Root from "./components/root";
import registerServiceWorker from "./register-service-worker";

const App = () => (
  <Provider store={redux}>
    <Root />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
