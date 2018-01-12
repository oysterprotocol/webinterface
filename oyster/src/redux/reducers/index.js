import { combineReducers } from "redux";

// TODO: Create real reducers
const reducer = (state = { hello: "world" }, action) => state;

export default combineReducers({ reducer });
