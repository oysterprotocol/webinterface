import { combineReducers } from "redux";

import example from "redux/reducers/example-reducer";
import file from "redux/reducers/file-reducer";

export default combineReducers({ example, file });
