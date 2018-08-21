import IOTA from "iota.lib.js";
import Stream from "oyster-streamable";

import { IOTA_API } from "../config";
import { OLD_TANGLE_NODE } from "../config";

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
    chunksDeliveredCb,
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
  u.on("retrieved", chunksDeliveredCb);
  u.on("upload-progress", uploadProgressCb);
  u.on("finish", doneCb);
  u.on("error", errCb);
};

export const streamUploadProgress = (
    handle,
    {
        uploadProgressCb,
        doneCb,
        errCb
    }
    ) => {
    const u = Stream.UploadProgress.streamUploadProgress(handle, {
        iotaProvider: new IOTA({ provider: IOTA_API.PROVIDER_A })
    });

    u.on("upload-progress", uploadProgressCb);
    u.on("finish", doneCb);
    u.on("error", errCb);
};

export const streamDownload = (
  handle,
  {},
  { metaCb, progressCb, doneCb, errCb }
) => {
  const d = Stream.Download.toBlob(handle, {
    iotaProviders: [
      new IOTA({ provider: OLD_TANGLE_NODE }),
      new IOTA({ provider: IOTA_API.PROVIDER_A })
    ]
  });

  d.on("meta", metaCb);
  d.on("download-progress", progressCb);
  d.on("finish", doneCb);
  d.on("error", errCb);
};
