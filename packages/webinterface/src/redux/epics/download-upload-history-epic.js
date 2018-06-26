import { combineEpics } from "redux-observable";
import FileSaver from "file-saver";

import downloadUploadHistoryActions from "redux/actions/download-upload-history-actions";

const beginDownloadUploadHistory = (action$, store) => {
  return action$.ofType(downloadUploadHistoryActions.BEGIN_UPLOAD_HISTORY_DOWNLOAD).filter(() => {
    const { upload: { history } } = store.getState();
    return !!history.length;
  }).map(action => {
    const { upload: { history } } = store.getState();
    const items =  history.map((e, i) => (e));
    const json = JSON.stringify(items);
    let blob = new Blob([json], {type: "application/json"});
    FileSaver.saveAs(blob, "handle.json");
    return downloadUploadHistoryActions.downloadUploadHistorySuccessAction();
  });
};

export default combineEpics(beginDownloadUploadHistory);
