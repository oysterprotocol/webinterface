import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";

import uploadActions from "redux/actions/upload-actions";
import navigationActions from "redux/actions/navigation-actions";

import { UPLOAD_STATUSES } from "config";
import Iota from "services/iota";
import Backend from "services/backend";
import { streamUpload } from "services/oyster-stream";
import Datamap from "datamap-generator";
import FileProcessor from "utils/file-processor";
import IndexSelector from "utils/index-selector";
import {
  IOTA_API,
  IOTA_POLL_INTERVAL,
  NUM_POLLING_ADDRESSES
} from "../../config";

const BUNDLE_SIZE = IOTA_API.BUNDLE_SIZE;

const initializeUpload = (action$, store) => {
  return action$.ofType(uploadActions.INITIALIZE_UPLOAD).mergeMap(action => {
    const { file, retentionYears } = action.payload;

    return Observable.fromPromise(FileProcessor.initializeUpload(file)).map(
      ({ numberOfChunks, handle, fileName, chunks }) => {
        return uploadActions.initializeSession({
          chunks,
          fileName,
          handle,
          numberOfChunks,
          retentionYears
        });
      }
    );
  });
};

const streamUploadEpic = action$ =>
  action$.ofType(uploadActions.STREAM_UPLOAD).mergeMap(action => {
    const {
      file,
      retentionYears,
      brokers // { alpha, beta }
    } = action.payload;

    const params = {
      file,
      retentionYears,
      brokers
    };

    return Observable.create(o => {
      // TODO: Update oyster-streamable to match this API.
      streamUpload(params, {
        invoiceCb: invoice => {
          let cost, ethAddress; // TODO

          o.next(uploadActions.streamInvoiced({ cost, ethAddress }));
        },

        paymentPendingCb: _ => {
          o.next(uploadActions.streamPaymentPending());
        },

        paymentConfirmedCb: payload => {
          let filename, handle, numberOfChunks; // TODO
          o.next(
            uploadActions.streamPaymentConfirmed({
              filename,
              handle,
              numberOfChunks
            })
          );
        },

        uploadProgressCb: progress => {
          // TODO: Pass in progress
          o.next(uploadActions.streamUploadProgress({ progress }));
        },

        doneCb: result => {
          let handle; // TODO
          o.complete(uploadActions.streamUploadSuccess({ handle }));
        },

        errCb: err => {
          let handle; // TODO
          // window.alert the error.

          // Use complete instead of error so observable isn't taken down.
          o.complete(uploadActions.streamUploadError({ handle, err }));
        }
      });
    });
  });

const initializeSession = (action$, store) => {
  return action$.ofType(uploadActions.INITIALIZE_SESSION).mergeMap(action => {
    const { chunks, fileName, handle, retentionYears } = action.payload;

    return Observable.fromPromise(
      Backend.initializeUploadSession(chunks, fileName, handle, retentionYears)
    ).map(
      ({
        alphaSessionId,
        betaSessionId,
        invoice,
        numberOfChunks,
        handle,
        fileName,
        genesisHash,
        storageLengthInYears,
        host
      }) => {
        return uploadActions.pollPaymentStatus({
          host,
          alphaSessionId,
          chunks,
          fileName,
          handle,
          numberOfChunks,
          betaSessionId,
          genesisHash,
          invoice
        });
      }
    );
  });
};

const pollPaymentStatus = (action$, store) => {
  return action$.ofType(uploadActions.POLL_PAYMENT_STATUS).mergeMap(action => {
    const {
      host,
      alphaSessionId,
      chunks,
      fileName,
      handle,
      numberOfChunks,
      betaSessionId,
      genesisHash,
      invoice
    } = action.payload;

    return Observable.interval(3000)
      .startWith(0)
      .takeUntil(action$.ofType(uploadActions.BEGIN_UPLOAD))
      .mergeMap(() =>
        Observable.fromPromise(
          Backend.confirmPaid(host, alphaSessionId)
        ).mergeMap(paymentStatus => {
          switch (paymentStatus) {
            case "invoiced":
              return Observable.empty();
            case "pending":
              return Observable.of(uploadActions.paymentPending());
            case "confirmed":
              return Observable.of(
                uploadActions.beginUploadAction({
                  chunks,
                  fileName,
                  handle,
                  numberOfChunks,
                  alphaSessionId,
                  betaSessionId,
                  genesisHash,
                  invoice
                })
              );
            default:
              return Observable.of(navigationActions.errorPageAction());
          }
        })
      );
  });
};

const getGasPrice = (action$, store) => {
  return action$.ofType(uploadActions.INITIALIZE_SESSION).mergeMap(action => {
    return Observable.fromPromise(Backend.getGasPrice()).mergeMap(prices => {
      return Observable.of(uploadActions.gasPrice(prices));
    });
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
    const {
      chunks,
      fileName,
      handle,
      numberOfChunks,
      alphaSessionId,
      betaSessionId,
      genesisHash
    } = action.payload;

    return Observable.fromPromise(
      Backend.uploadFile(
        chunks,
        fileName,
        handle,
        alphaSessionId,
        betaSessionId,
        genesisHash
      )
    )
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
    const genHash = Datamap.genesisHash(handle);
    const datamap = Datamap.generate(genHash, numberOfChunks - 1);
    const addresses = _.values(datamap);
    // console.log("POLLING 81 CHARACTER IOTA ADDRESSES: ", addresses);

    return Observable.merge(
      Observable.of(
        uploadActions.initializePollingIndexes({
          dataMapLength: addresses.length,
          indexes: IndexSelector.selectPollingIndexes(
            addresses,
            NUM_POLLING_ADDRESSES,
            BUNDLE_SIZE
          )
        })
      ),
      Observable.interval(IOTA_POLL_INTERVAL)
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
          let { indexes, startingLength } = store.getState().upload.indexes;
          return Observable.fromPromise(
            Iota.checkUploadPercentage(addresses, indexes)
          )
            .map(({ updatedIndexes }) => {
              let uploadProgress =
                ((startingLength - updatedIndexes.length) / startingLength) *
                100;

              return uploadActions.updateUploadProgress({
                handle,
                uploadProgress,
                indexes: updatedIndexes
              });
            })
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
  streamUploadEpic,
  initializeSession,
  pollPaymentStatus,
  saveToHistory,
  uploadFile,
  getGasPrice,
  pollUploadProgress,
  markUploadAsComplete,
  refreshIncompleteUploads
);
