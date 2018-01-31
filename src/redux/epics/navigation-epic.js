import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import { push } from "react-router-redux";

import uploadActions from "redux/actions/upload-actions";
import downloadActions from "redux/actions/download-actions";
import navigationActions from "redux/actions/navigation-actions";

const goToDownloadForm = (action$, store) => {
  return action$
    .ofType(navigationActions.VISIT_DOWNLOAD_FORM)
    .map(action => push("/download-form"));
};

const goToDownloadStarted = (action$, store) => {
  return action$
    .ofType(downloadActions.BEGIN_DOWNLOAD)
    .map(action => push("/download-started"));
};

const goToUploadForm = (action$, store) => {
  return action$
    .ofType(navigationActions.VISIT_UPLOAD_FORM)
    .map(action => push("/upload-form"));
};

const goToUploadStarted = (action$, store) => {
  return action$
    .ofType(uploadActions.BEGIN_UPLOAD)
    .map(action => push("/upload-started"));
};

const goToUploadComplete = (action$, store) => {
  return action$
    .ofType(uploadActions.MARK_UPLOAD_AS_COMPLETE)
    .map(action => push("/upload-complete"));
};

export default combineEpics(
  goToDownloadForm,
  goToDownloadStarted,
  goToUploadForm,
  goToUploadStarted,
  goToUploadComplete
);
