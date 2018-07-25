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

const goToUploadStarted = (action$, store) => {
  return action$
    .ofType(uploadActions.BEGIN_UPLOAD)
    .map(() => push("/upload-started"));
};

const goToUploadStartedStream = (action$, store) => {
  return action$
    .ofType(uploadActions.STREAM_PAYMENT_CONFIRMED)
    .map(() => push("/upload-started"));
};

const goToUploadComplete = (action$, store) => {
  return action$
    .ofType(uploadActions.MARK_UPLOAD_AS_COMPLETE)
    .map(() => push("/upload-complete"));
};

const goToUploadCompleteStream = (action$, store) => {
  return action$
    .ofType(uploadActions.STREAM_UPLOAD_SUCCESS)
    .map(() => push("/upload-complete"));
};

const goToPaymentInvoice = (action$, store) => {
  return action$
    .ofType(uploadActions.POLL_PAYMENT_STATUS)
    .map(() => push("/payment-invoice"));
};

const goToPaymentInvoiceStream = (action$, store) => {
  return action$
    .ofType(uploadActions.STREAM_INVOICED)
    .map(() => push("/payment-invoice"));
};

const goToPaymentConfirmation = (action$, store) => {
  return action$
    .ofType(uploadActions.PAYMENT_PENDING)
    .map(() => push("/payment-confirm"));
};

const goToPaymentConfirmationStream = (action$, store) => {
  return action$
    .ofType(uploadActions.STREAM_PAYMENT_PENDING)
    .map(action => push("/payment-confirm"));
};

const goToRetrievingInvoice = (action$, store) => {
  return action$
    .ofType(uploadActions.INITIALIZE_UPLOAD)
    .map(() => push("/retrieving-invoice"));
};

const goToErrorPage = (action$, store) => {
  return action$
    .ofType(navigationActions.ERROR_PAGE)
    .map(() => push("/error-page"));
};

export default combineEpics(
  goToDownloadForm,
  goToUploadForm,
  goToUploadStarted,
  goToUploadStartedStream,
  goToUploadComplete,
  goToUploadCompleteStream,
  goToPaymentInvoice,
  goToPaymentInvoiceStream,
  goToPaymentConfirmation,
  goToPaymentConfirmationStream,
  goToRetrievingInvoice,
  goToErrorPage
);
