import axios from "axios";

// TODO: Put all interactions with backend here.

const BROKER_NODE_URL = "https://www.google.com"; // TODO: Real url.
const POLLING_FREQ = 4; // 4 seconds.
const POLLING_TIMEOUT = 100000000; // TODO: Agree on a timeout value.

export const CHUNK_STATUSES = Object.freeze({
  COMPLETE: "COMPLETE",
  TIMEOUT: "TIMEOUT",
  ERROR: "ERROR"
});

const CHUNK_STATUSES_API = Object.freeze({
  PENDING: "pending",
  COMPLETE: "complete"
});

/**
 * @returns promise that resolve when chunk status is complete and rejects
 * when status is not (complete || pending) or timeout.
 */
export const pollUntilComplete = (genHash, chunkIdx) =>
  new Promise((resolve, reject) => {
    const startTs = Date.now();
    const params = { genesis_hash: genHash, chunk_idx: chunkIdx };

    const pollInterval = setInterval(() => {
      if (Date.now() > startTs + POLLING_TIMEOUT) {
        clearInterval(pollInterval);
        return reject({ status: CHUNK_STATUSES.TIMEOUT });
      }

      axios
        .get(`BROKER_NODE_URL/api/v1/chunk-status`, params)
        .then(({ status }) => {
          switch (status) {
            case CHUNK_STATUSES_API.PENDING:
              return; // continue polling.
            case CHUNK_STATUSES_API.COMPLETE:
              clearInterval(pollInterval);
              return resolve({ status: "complete" });
            default:
              // assumes error.
              clearInterval(pollInterval);
              return reject({ status: CHUNK_STATUSES.ERROR });
          }
        });
    }, POLLING_FREQ);
  });
