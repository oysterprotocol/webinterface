import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { ConnectedRouter } from "react-router-redux";
import { Route } from "react-router";
import createHistory from "history/createBrowserHistory";

import { store, persistor } from "./redux";
import Root from "./components/root";
import registerServiceWorker from "./register-service-worker";
// persistor.purge();
const history = createHistory();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <Route exact path="/" component={Root} />
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
