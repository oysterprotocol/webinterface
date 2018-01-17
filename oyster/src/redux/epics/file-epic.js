import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";

import fileActions from "redux/actions/file-actions";

import FileProcessor from "utils/file-processor";

// TODO: Firebase can handle syncing through pushes. No need to pull these.
function uploadFile(action$, store) {
  return action$.ofType(fileActions.UPLOAD).mergeMap(action => {
    const file = action.payload;
    return Observable.fromPromise(FileProcessor.uploadFileToBrokerNodes(file))
      .map(fileActions.uploadSuccessAction)
      .catch(error => {
        console.log("ERRRRRORRRRRR: ", error);
        return Observable.of(fileActions.uploadFailureAction);
      });
  });
}

export default combineEpics(uploadFile);
