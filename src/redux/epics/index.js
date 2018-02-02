import { combineEpics } from "redux-observable";

import uploadEpic from "redux/epics/upload-epic";
import downloadEpic from "redux/epics/download-epic";
import navigationEpic from "redux/epics/navigation-epic";
import playgroundEpic from "redux/epics/playground-epic";

export default combineEpics(
  uploadEpic,
  downloadEpic,
  navigationEpic,
  playgroundEpic
);
