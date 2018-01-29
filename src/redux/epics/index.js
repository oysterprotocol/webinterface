import { combineEpics } from "redux-observable";

import uploadEpic from "redux/epics/upload-epic";
import downloadEpic from "redux/epics/download-epic";

export default combineEpics(uploadEpic, downloadEpic);
