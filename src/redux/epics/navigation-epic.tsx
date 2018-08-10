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
    .ofType(uploadActions.STREAM_CHUNKS_DELIVERED)
    .map(() => push("/upload-progress"));
};

const goToUploadCompleteStream = (action$, store) => {
  return action$
    .ofType(uploadActions.STREAM_UPLOAD_SUCCESS)
    .map(() => push("/upload-complete"));
};

const goToPaymentInvoiceStream = (action$, store) => {
  return action$
    .ofType(uploadActions.STREAM_INVOICED)
    .map(() => push("/payment-invoice"));
};

const goToPaymentConfirmationStream = (action$, store) => {
  return action$
    .ofType(uploadActions.STREAM_PAYMENT_PENDING)
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
