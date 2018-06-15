import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";

import uploadActions from "redux/actions/upload-actions";

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

const streamUpload = action$ =>
  action$.ofType(uploadActions.UPLOAD_STREAM).mergeMap(action => {
    // TODO: Figure out what payload is needed and pass it in.
    const {
      file,
      brokers: { alpha, beta }
    } = action.payload;

    const handlers = {
      invoiceCb: invoice => {
        // TODO: Figure out what invoice will contain.
        const invoiceAction = {}; // Figure this out.
        o.next(invoiceAction);
      },
      paymentConfirmedCb: payload => {
        // TODO: Figure out what invoice will contain.
        const paymentConfirmedAction = {}; // Figure this out.
        o.next(paymentConfirmedAction);
      },
      upoadProgressCb: progress => {
        // TODO: Figure out what invoice will contain.
        const uploadProgressAction = {}; // Figure this out.
        o.next(uploadProgressAction);
      },
      doneCb: result => {
        const completeAction = {}; // TODO: create UPLOAD_COMPLETED action with payload
        o.complete(completeAction);
      },
      errCb: err => {
        const errAction = {}; // TODO: create UPLOAD_ERR action with payload
        o.complete(errAction); // Use complete instead of error so observable isn't taken down.
      }
    };

    return Observable.create(o => {
      streamUpload(file, { alpha, beta }, handlers);
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
  initializeSession,
  pollPaymentStatus,
  saveToHistory,
  uploadFile,
  getGasPrice,
  pollUploadProgress,
  markUploadAsComplete,
  refreshIncompleteUploads
);
