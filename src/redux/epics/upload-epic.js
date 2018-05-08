import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";

import uploadActions from "redux/actions/upload-actions";

import { UPLOAD_STATUSES } from "config";
import Iota from "services/iota";
import Backend from "services/backend";
import Datamap from "datamap-generator";
import FileProcessor from "utils/file-processor";
import { IOTA_API } from "config";
import { NUM_BROKER_CHANNELS } from "config";
import { SECONDS_PER_CHUNK } from "config";

const BUNDLE_SIZE = IOTA_API.BUNDLE_SIZE;

const UPLOAD_POLL_FREQUENCY =
  BUNDLE_SIZE * SECONDS_PER_CHUNK / NUM_BROKER_CHANNELS * 1000;

const initializeUpload = (action$, store) => {
  return action$.ofType(uploadActions.INITIALIZE_UPLOAD).mergeMap(action => {
    const file = action.payload;
    return Observable.fromPromise(FileProcessor.initializeUpload(file)).map(
      ({ numberOfChunks, handle, fileName, chunks }) => {
        return uploadActions.beginUploadAction({
          chunks,
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
    const { chunks, fileName, handle } = action.payload;

    return Observable.fromPromise(Backend.uploadFile(chunks, fileName, handle))
      .map(({ numberOfChunks, handle }) =>
        uploadActions.uploadSuccessAction(handle)
      )
      .catch(error => Observable.of(uploadActions.uploadFailureAction(error)));
  });
};

const refreshIncompleteUploads = (action$, store) => {
  return action$
    .ofType(uploadActions.REFRESH_INCOMPLETE_UPLOADS)
    .flatMap(action => {
      const {
        upload: { history }
      } = store.getState();
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
    const datamap = Datamap.generate(handle, numberOfChunks - 1);
    const addresses = _.values(datamap);
    // console.log("POLLING 81 CHARACTER IOTA ADDRESSES: ", addresses);

    return Observable.merge(
      Observable.of(
        uploadActions.initializePollingIndexes({
          dataMapLength: addresses.length,
          frontIdx: 0,
          backIdx: addresses.length - 1
        })
      ),
      Observable.interval(UPLOAD_POLL_FREQUENCY)
        .takeUntil(
          Observable.merge(
            action$.ofType(uploadActions.MARK_UPLOAD_AS_COMPLETE).filter(a => {
              const completedFileHandle = a.payload;
              return handle === completedFileHandle;
            }),
            action$.ofType(uploadActions.UPLOAD_FAILURE)
          )
        )
        .mergeMap(action => {
          let { frontIdx, backIdx } = store.getState().upload.indexes;
          return Observable.fromPromise(
            Iota.checkUploadPercentage(addresses, frontIdx, backIdx)
          )
            .map(
              ({
                updateFrontIndex,
                updateBackIndex,
                frontIndex,
                backIndex
              }) => {
                let uploadProgress =
                  frontIndex >= backIndex - 1
                    ? 100
                    : (frontIndex + (addresses.length - 1 - backIndex)) /
                      (addresses.length - 2) *
                      100;

                frontIndex = updateFrontIndex
                  ? Math.min(
                      ...[
                        frontIndex +
                          Math.floor(Math.random() * (BUNDLE_SIZE / 2)) +
                          BUNDLE_SIZE / 2,
                        addresses.length - 1
                      ]
                    )
                  : frontIndex;

                backIndex = updateBackIndex
                  ? Math.max(
                      ...[
                        backIndex -
                          Math.floor(Math.random() * (BUNDLE_SIZE / 2)) -
                          BUNDLE_SIZE / 2,
                        0
                      ]
                    )
                  : backIndex;

                return uploadActions.updateUploadProgress({
                  handle,
                  uploadProgress,
                  frontIndex,
                  backIndex
                });
              }
            )
            .catch(error => Observable.empty());
        })
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
