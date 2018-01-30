import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import { push } from "react-router-redux";

import uploadActions from "redux/actions/upload-actions";

const goToUploadStarted = (action$, store) => {
  return action$
    .ofType(uploadActions.INITIALIZE_UPLOAD)
    .map(action => push("/upload-started"));
};

export default combineEpics(goToUploadStarted);
