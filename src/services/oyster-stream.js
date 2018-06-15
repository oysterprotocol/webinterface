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
  { inoviceCb, paymentConfirmedCb, uploadProgressCb, doneCb, errCb }
) => {
  const u = Upload.fromFile(file).startUpload({
    alphaSessionId: alpha,
    betaSessionId: beta
  });

  u.on("invoice", inoviceCb); // TODO: Document what is passed to the cb.
  u.on("payment-confirmed", paymentConfirmedCb);
  u.on("upload-progress", uploadProgressCb);
  u.on("finish", doneCb);
  u.on("error", errCb);
};
