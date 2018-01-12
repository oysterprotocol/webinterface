import { applyMiddleware, compose, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";

import epics from "./epics";
import reducer from "./reducers";

const middleware = [createEpicMiddleware(epics)];
const store = createStore(reducer, compose(applyMiddleware(...middleware)));

export default store;
