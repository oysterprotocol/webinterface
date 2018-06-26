import { Upload } from "oyster-streamable";

/**
 *
 * @param {File} file
 * @param {Object} config { alpha, beta }
 * @param {Object} handlers { invoiceCb, doneCb, errCb }
 */
export const streamUpload = (
  file,
  { alpha, beta },
  {
    invoiceCb,
    paymentPendingCb,
    paymentConfirmedCb,
    uploadProgressCb,
    doneCb,
    errCb
  }
) => {
  // TODO: Brokers are not yet configurable in oyster-streamable.
  // They are hardcoded.
  const u = Upload.fromFile(file, { brokers: { alpha, beta } });

  u.on("invoice", invoiceCb);
  u.on("payment-pending", paymentPendingCb);
  u.on("payment-confirmed", paymentConfirmedCb);
  u.on("upload-progress", uploadProgressCb);
  u.on("finish", doneCb);
  u.on("error", errCb);
};
