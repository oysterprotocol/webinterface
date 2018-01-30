import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { ConnectedRouter } from "react-router-redux";
import { Route } from "react-router";

import { store, persistor } from "./redux";
import history from "redux/history";
import Root from "components/root";
import Example from "components/example";
import registerServiceWorker from "./register-service-worker";

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" component={Root} />
          <Route path="/upload-started" component={Example} />
        </div>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
