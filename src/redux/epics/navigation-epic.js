import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import { push } from "react-router-redux";

import uploadActions from "redux/actions/upload-actions";
import navigationActions from "redux/actions/navigation-actions";

const goToUploadStarted = (action$, store) => {
  return action$
    .ofType(uploadActions.INITIALIZE_UPLOAD)
    .map(action => push("/upload-started"));
};

const goToUploadForm = (action$, store) => {
  return action$
    .ofType(navigationActions.VISIT_UPLOAD_FORM)
    .map(action => push("/upload-form"));
};

export default combineEpics(goToUploadStarted, goToUploadForm);
