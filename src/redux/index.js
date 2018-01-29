import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { UPLOAD_STATUSES } from "config";
import epics from "redux/epics";
import reducer from "redux/reducers";
import uploadActions from "redux/actions/upload-actions";

const composeFn = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [
  process.env.NODE_ENV === `development` && createLogger(),
  createEpicMiddleware(epics)
];

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
