import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";

import uploadActions from "redux/actions/upload-actions";

import { UPLOAD_STATUSES } from "config";
import Iota from "services/iota";
import Backend from "services/backend";
import { generate as genDatamap } from "datamap-generator";
import FileProcessor from "utils/file-processor";

const initializeUpload = (action$, store) => {
  return action$.ofType(uploadActions.INITIALIZE_UPLOAD).mergeMap(action => {
    const file = action.payload;
    return Observable.fromPromise(FileProcessor.initializeUpload(file)).map(
      ({ numberOfChunks, handle, fileName, data }) => {
        return uploadActions.beginUploadAction({
          data,
          fileName,
          handle,
          numberOfChunks
        });
      }
    );
  });
};

const saveToHistory = (action$, store) => {
  return action$.ofType(uploadActions.BEGIN_UPLOAD).map(action => {
    const { handle, fileName } = action.payload;
    return uploadActions.addToHistoryAction({
      handle,
      fileName
    });
  });
};

const uploadFile = (action$, store) => {
  return action$.ofType(uploadActions.BEGIN_UPLOAD).mergeMap(action => {
    const { data, fileName, handle } = action.payload;

    return Observable.fromPromise(Backend.uploadFile(data, fileName, handle))
      .map(({ numberOfChunks, handle, fileName }) =>
        uploadActions.uploadSuccessAction(handle)
      )
      .catch(error => Observable.of(uploadActions.uploadFailureAction(error)));
  });
};

const refreshIncompleteUploads = (action$, store) => {
  return action$
    .ofType(uploadActions.REFRESH_INCOMPLETE_UPLOADS)
    .flatMap(action => {
      const { upload: { history } } = store.getState();
      const incompleteUploads = history.filter(
        f => f.status === UPLOAD_STATUSES.SENT && f.uploadProgress < 100
      );
      return incompleteUploads.map(({ numberOfChunks, handle }) =>
        uploadActions.pollUploadProgress({ numberOfChunks, handle })
      );
    });
};

const pollUploadProgress = (action$, store) => {
  return action$.ofType(uploadActions.BEGIN_UPLOAD).switchMap(action => {
    const { numberOfChunks, handle } = action.payload;
    const datamap = genDatamap(handle, numberOfChunks);
    const addresses = _.values(datamap);
    // console.log("POLLING 81 CHARACTER IOTA ADDRESSES: ", addresses);

    return Observable.interval(5000)
      .takeUntil(
        Observable.merge(
          action$.ofType(uploadActions.MARK_UPLOAD_AS_COMPLETE).filter(a => {
            const completedFileHandle = a.payload;
            return handle === completedFileHandle;
          }),
          action$.ofType(uploadActions.UPLOAD_FAILURE)
        )
      )
      .mergeMap(action =>
        Observable.fromPromise(Iota.checkUploadPercentage(addresses))
          .map(uploadProgress =>
            uploadActions.updateUploadProgress({ handle, uploadProgress })
          )
          .catch(error => Observable.empty())
      );
  });
};

const markUploadAsComplete = (action$, store) => {
  return action$
    .ofType(uploadActions.UPDATE_UPLOAD_PROGRESS)
    .filter(action => {
      const { uploadProgress } = action.payload;
      return uploadProgress >= 100;
    })
    .map(action => {
      const { handle } = action.payload;
      return uploadActions.markUploadAsComplete(handle);
    });
};

export default combineEpics(
  initializeUpload,
  saveToHistory,
  uploadFile,
  pollUploadProgress,
  markUploadAsComplete,
  refreshIncompleteUploads
);
