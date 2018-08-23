import { combineEpics } from "redux-observable";
import { push } from "react-router-redux";

import uploadActions from "../actions/upload-actions";
import navigationActions from "../actions/navigation-actions";

const goToDownloadForm = (action$, store) => {
  return action$
    .ofType(navigationActions.VISIT_DOWNLOAD_FORM)
    .map(() => push("/download-form"));
};

const goToUploadForm = (action$, store) => {
  return action$
    .ofType(navigationActions.VISIT_UPLOAD_FORM)
    .map(() => push("/upload-form"));
};

const goToUploadStartedStream = (action$, store) => {
  return action$
    .ofType(uploadActions.CHUNKS_DELIVERED)
    .map(action => push("/upload-progress?handle=" + action.payload.handle));
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

export default combineEpics(
  goToDownloadForm,
  goToUploadForm,
  goToUploadStartedStream,
  goToUploadCompleteStream,
  goToPaymentInvoiceStream,
  goToPaymentConfirmationStream,
  goToErrorPage
);
