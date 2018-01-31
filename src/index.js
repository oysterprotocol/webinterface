import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { ConnectedRouter } from "react-router-redux";
import { Route } from "react-router";

import { store, persistor } from "./redux";
import history from "redux/history";
import Root from "components/root";
import Header from "components/shared/header";
import DownloadReady from "components/download-ready";
import UploadForm from "components/upload-form";
import registerServiceWorker from "./register-service-worker";

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <div>
          <Header />
          <Route exact path="/" component={Root} />
          <Route path="/upload-form" component={UploadForm} />
          <Route path="/upload-started" component={DownloadReady} />
        </div>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
