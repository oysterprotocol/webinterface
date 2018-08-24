import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";

import uploadActions from "../actions/upload-actions";
import { execObsverableIfBackendAvailable } from "./utils";
import { streamUpload } from "../../services/oyster-stream";
import { alertUser } from "../../services/error-tracker";
import { API } from "../../config";

const streamUploadEpic = action$ =>
  action$.ofType(uploadActions.UPLOAD).mergeMap(action => {
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

            chunksDeliveredCb: payload => {    
                const handle = payload.handle;
                console.log(handle);
                o.next(uploadActions.streamChunksDelivered({ handle}));
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

export default combineEpics(streamUploadEpic);
