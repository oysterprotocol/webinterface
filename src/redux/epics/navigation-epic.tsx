import { combineEpics } from "redux-observable";
import { push } from "react-router-redux";
import { Observable } from "rxjs/Rx";
import queryString from "query-string";

import { API } from "../../config";
import uploadActions from "../actions/upload-actions";
import { UPLOAD_STATE } from "../reducers/upload-reducer";
import navigationActions from "../actions/navigation-actions";
import { execObservableIfBackendAvailable } from "./utils";

const LOCATION_CHANGE_ACTION = "@@router/LOCATION_CHANGE";

const goToDownloadForm = (action$, store) => {
  return action$
    .ofType(navigationActions.VISIT_DOWNLOAD_FORM)
    .map(() => push("/download-form"));
};

const goToUploadForm = (action$, store) => {
  return action$.ofType(navigationActions.VISIT_UPLOAD_FORM).mergeMap(() => {
    return execObservableIfBackendAvailable(
      [API.BROKER_NODE_A, API.BROKER_NODE_B],
      () =>
        Observable.create(o => {
          o.next(push("/upload-form"));
        }),
      () =>
        Observable.create(o => {
          o.next(push("/brokers-down"));
        })
    );
  });
};

const goToUploadStarted = (action$, store) => {
  return action$
    .ofType(uploadActions.PAYMENT_CONFIRMED)
    .map(action => push("/upload-started"));
};

const goToUploadProgress = (action$, store) => {
  return action$
    .ofType(uploadActions.CHUNKS_DELIVERED)
    .map(action => push(`/upload-progress#handle=${action.payload.handle}`));
};

const goToUploadCompleteStream = (action$, store) => {
  return action$
    .ofType(uploadActions.UPLOAD_SUCCESS)
    .map(() => push("/upload-complete"));
};

const goToPaymentInvoiceStream = (action$, store) => {
  return action$
    .ofType(uploadActions.INVOICED)
    .map(() => push("/payment-invoice"));
};

const goToPaymentConfirmationStream = (action$, store) => {
  return action$
    .ofType(uploadActions.PAYMENT_PENDING)
    .map(action => push("/payment-confirm"));
};

const goToErrorPage = (action$, store) => {
  return action$
    .ofType(navigationActions.ERROR_PAGE)
    .map(() => push("/error-page"));
};

const goToBrokersDownPage = (action$, store) => {
  return action$
    .ofType(navigationActions.BROKERS_DOWN)
    .map(() => push("/brokers-down"));
};

const uploadProgressListener = (action$, store) => {
  return action$
    .ofType(LOCATION_CHANGE_ACTION)
    .filter(({ payload: { pathname } }) => pathname === "/upload-progress")
    .switchMap(({ payload: { hash } }) => {
      const {
        upload: { uploadState }
      } = store.getState();

      // Prevent from getting into a cycle from the normal synchronous flow.
      if (uploadState === UPLOAD_STATE.COMPLETE) return Observable.empty();

      const { handle } = queryString.parse(hash);
      return Observable.of(uploadActions.streamChunksDelivered({ handle }));
    });
};

export default combineEpics(
  goToDownloadForm,
  goToUploadForm,
  goToUploadStarted,
  goToUploadProgress,
  goToUploadCompleteStream,
  goToPaymentInvoiceStream,
  goToPaymentConfirmationStream,
  goToErrorPage,
  goToBrokersDownPage,
  uploadProgressListener
);
