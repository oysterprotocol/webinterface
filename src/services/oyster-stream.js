import IOTA from "iota.lib.js";
import Stream from "oyster-streamable";

import { IOTA_API } from "../../src/config";

/**
 *
 * @param {File} file
 * @param {Object} config { alpha, beta }
 * @param {Object} handlers { invoiceCb, doneCb, errCb }
 */
export const streamUpload = (
  file,
  { alpha, beta, retentionYears },
  {
    invoiceCb,
    paymentPendingCb,
    paymentConfirmedCb,
    uploadProgressCb,
    doneCb,
    errCb
  }
) => {
  const u = Stream.Upload.fromFile(file, {
    alpha,
    beta,
    epochs: retentionYears,
    iotaProvider: new IOTA({ provider: IOTA_API.PROVIDER_A })
  });

  u.on("invoice", invoiceCb);
  u.on("payment-pending", paymentPendingCb);
  u.on("payment-confirmed", paymentConfirmedCb);
  u.on("upload-progress", uploadProgressCb);
  u.on("finish", doneCb);
  u.on("error", errCb);
};
