import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Route } from "react-router";
import createHistory from "history/createBrowserHistory";
import { routerMiddleware } from "react-router-redux";

import { UPLOAD_STATUSES } from "config";
import epics from "redux/epics";
import reducer from "redux/reducers";
import uploadActions from "redux/actions/upload-actions";

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

const composeFn = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [
  process.env.NODE_ENV === `development` && createLogger(),
  createEpicMiddleware(epics),
  routerMiddleware(history)
].filter(x => !!x);

const uploadTransform = createTransform(
  inboundState => inboundState,
  outboundState => {
    const { history } = outboundState;
    const sentFiles = history.filter(f => f.status === UPLOAD_STATUSES.SENT);
    return { ...outboundState, history: sentFiles };
  },
  { whitelist: ["upload"] }
);

const persistConfig = {
  key: "oyster",
  storage: storage,
  whitelist: ["upload"],
  transforms: [uploadTransform]
};

export const store = createStore(
  persistReducer(persistConfig, reducer),
  composeFn(applyMiddleware(...middleware))
);

export const persistor = persistStore(store, {}, () => {
  store.dispatch(uploadActions.refreshIncompleteUploads());
});
