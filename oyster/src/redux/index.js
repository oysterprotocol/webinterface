import { applyMiddleware, compose, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";

import epics from "./epics";
import reducer from "./reducers";

const composeFn = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [createEpicMiddleware(epics)];
const store = createStore(reducer, composeFn(applyMiddleware(...middleware)));

export default store;
