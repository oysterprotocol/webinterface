import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import upload from "../reducers/upload-reducer";
import uploadHistory from "../reducers/upload-history-reducer";
import download from "../reducers/download-reducer";

export default combineReducers({
  upload,
  uploadHistory,
  download,
  router: routerReducer
});
