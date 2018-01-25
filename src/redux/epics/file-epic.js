import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";

import fileActions from "redux/actions/file-actions";

import { IOTA_API } from "config";
import Iota from "services/iota";
import Datamap from "utils/datamap";
import FileProcessor from "utils/file-processor";

function uploadFile(action$, store) {
  return action$.ofType(fileActions.UPLOAD).mergeMap(action => {
    const file = action.payload;
    return Observable.fromPromise(FileProcessor.uploadFileToBrokerNodes(file))
      .map(({ numberOfChunks, genesisHash }) =>
        fileActions.uploadSuccessAction({ numberOfChunks, genesisHash })
      )
      .catch(error => {
        console.log("ERROR: ", error);
        return fileActions.uploadFailureAction;
      });
  });
}

function checkUploadProgress(action$, store) {
  return action$.ofType(fileActions.UPLOAD_SUCCESS).switchMap(action => {
    const { numberOfChunks, genesisHash } = action.payload;
    const datamap = Datamap.generate(numberOfChunks, genesisHash);
    const addresses = _.values(datamap).map(trytes =>
      trytes.substr(0, IOTA_API.ADDRESS_LENGTH)
    );
    console.log("POLLING 81 CHARACTER IOTA ADDRESSES: ", addresses);

    return Observable.interval(2000)
      .takeUntil(action$.ofType(fileActions.MARK_AS_COMPLETE))
      .mergeMap(action =>
        Observable.fromPromise(Iota.checkUploadPercentage(addresses)).map(
          percentage => fileActions.updateUploadProgress(percentage)
        )
      );
  });
}

function markDownloadAsComplete(action$, store) {
  return action$
    .ofType(fileActions.UPDATE_PROGRESS)
    .filter(action => {
      const percentage = action.payload;
      return percentage >= 100;
    })
    .map(() => fileActions.markDownloadAsComplete());
}

export default combineEpics(
  uploadFile,
  checkUploadProgress,
  markDownloadAsComplete
);
