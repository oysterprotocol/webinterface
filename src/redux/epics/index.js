import { combineEpics } from "redux-observable";

import uploadEpic from "redux/epics/upload-epic";
import downloadEpic from "redux/epics/download-epic";
import routeEpic from "redux/epics/route-epic";

export default combineEpics(uploadEpic, downloadEpic, routeEpic);
