import { combineEpics } from "redux-observable";

import fileEpic from "redux/epics/file-epic";

export default combineEpics(fileEpic);
