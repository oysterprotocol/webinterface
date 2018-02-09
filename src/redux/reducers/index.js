import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import upload from "redux/reducers/upload-reducer";
import download from "redux/reducers/download-reducer";

export default combineReducers({ upload, download, router: routerReducer });
