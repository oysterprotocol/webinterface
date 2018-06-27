import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import upload from "redux/reducers/upload-reducer";
import uploadHistory from "redux/reducers/upload-history-reducer";
import download from "redux/reducers/download-reducer";

export default combineReducers({
  upload,
  uploadHistory,
  download,
  router: routerReducer
});
