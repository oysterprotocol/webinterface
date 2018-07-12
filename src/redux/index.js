import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import { routerMiddleware } from "react-router-redux";
import createRavenMiddleware from "raven-for-redux";

import epics from "redux/epics";
import reducer from "redux/reducers";
import history from "redux/history";
import Raven from "../services/error-tracker";

const composeFn = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [
  process.env.NODE_ENV === `development` && createLogger(),
  createEpicMiddleware(epics),
  routerMiddleware(history),
  createRavenMiddleware(Raven, {})
].filter(x => !!x);

export const store = createStore(
  reducer,
  composeFn(applyMiddleware(...middleware))
);
