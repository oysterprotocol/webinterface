import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import epics from "redux/epics";
import reducer from "redux/reducers";

const composeFn = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [
  process.env.NODE_ENV === `development` && createLogger(),
  createEpicMiddleware(epics)
];

const persistConfig = {
  key: "oyster",
  storage: storage,
  whitelist: ["upload"]
};

export const store = createStore(
  persistReducer(persistConfig, reducer),
  composeFn(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);
