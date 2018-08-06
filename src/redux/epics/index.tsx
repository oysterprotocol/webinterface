import { combineEpics } from "redux-observable";

import uploadEpic from "./upload-epic";
import downloadEpic from "./download-epic";
import downloadUploadHistoryEpic from "./download-upload-history-epic";
import navigationEpic from "./navigation-epic";

export default combineEpics(
  uploadEpic,
  downloadEpic,
  downloadUploadHistoryEpic,
  navigationEpic
);
