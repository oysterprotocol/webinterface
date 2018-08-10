import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import { execObsverableIfBackendAvailable } from "./utils";
import uploadActions from "../actions/upload-actions";
import { streamUpload } from "../../services/oyster-stream";
import { alertUser } from "../../services/error-tracker";
import { API } from "../../config";


const streamUploadEpic = action$ =>
  action$.ofType(uploadActions.STREAM_UPLOAD).mergeMap(action => {
    const {
      file,
      retentionYears,
      brokers: { alpha, beta }
    } = action.payload;

    const params = { alpha, beta, retentionYears };

    return execObsverableIfBackendAvailable(
      [API.BROKER_NODE_A, API.BROKER_NODE_B],
      () =>
        Observable.create(o => {
          streamUpload(file, params, {
            invoiceCb: invoice => {
              o.next(uploadActions.streamInvoiced(invoice));
            },

            paymentPendingCb: _ => {
              o.next(uploadActions.streamPaymentPending());
            },

            paymentConfirmedCb: payload => {
              o.next(uploadActions.streamPaymentConfirmed(payload));
            },

            chunksDeliveredCb: () => {
              o.next(uploadActions.streamChunksDelivered());
            },

            uploadProgressCb: progress => {
              o.next(uploadActions.streamUploadProgress(progress));
            },

            doneCb: result => {
              const { handle } = result;
              o.next(uploadActions.streamUploadSuccess({ handle }));

              o.complete();
            },

            errCb: err => {
              let handle; // TODO
              alertUser(err);
              o.next(uploadActions.streamUploadError({ handle, err }));

              // Use complete instead of error so observable isn't taken down.
              o.complete();
            }
          });
        })
    );
  });

export default combineEpics(
  streamUploadEpic
);
