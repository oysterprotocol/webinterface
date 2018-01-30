import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import upload from "redux/reducers/upload-reducer";

export default combineReducers({ upload, router: routerReducer });
