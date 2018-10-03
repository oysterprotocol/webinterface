import { combineEpics } from "redux-observable";
import { push } from "react-router-redux";
import { Observable } from "rxjs/Rx";

import { API } from "../../config";
import uploadActions from "../actions/upload-actions";
import navigationActions from "../actions/navigation-actions";
import { execObservableIfBackendAvailable } from "./utils";

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

export default combineEpics(
  goToDownloadForm,
  goToUploadForm,
  goToUploadStarted,
  goToUploadProgress,
  goToUploadCompleteStream,
  goToPaymentInvoiceStream,
  goToPaymentConfirmationStream,
  goToErrorPage,
  goToBrokersDownPage
);
