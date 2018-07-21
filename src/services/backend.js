import _ from "lodash";
import axios from "axios";
import Datamap from "datamap-generator";

import { API, IS_DEV } from "../config";
import FileProcessor from "../utils/file-processor";
import { alertUser } from "./error-tracker";

const axiosInstance = axios.create({
  timeout: 200000
});

const adaptChunkToParams = (chunk, genesisHash) => ({
  idx: chunk.idx,
  data: chunk.data,
  // TODO: Move this up a level so chunks don't have to be addapted.
  hash: genesisHash
});

const uploadFile = (
  chunks,
  fileName,
  handle,
  alphaSessionId,
  betaSessionId,
  genesisHash
) => {
  console.log("UPLOADING FILE TO BROKER NODES");

  // Appends meta chunk

  return Promise.all([
    sendToAlphaBroker(alphaSessionId, chunks, genesisHash),
    sendToBetaBroker(betaSessionId, chunks, genesisHash)
  ])
    .then(() => {
      return {
        numberOfChunks: chunks.length,
        fileName,
        handle
      };
    })
    .catch(alertUser);
};

const checkStatus = host =>
  new Promise((resolve, reject) => {
    // TODO: Quick fix to get this deployed ASAP and pass Travis.
    // This should be removed later
    if (IS_DEV) return resolve(true);

    const host = API.BROKER_NODE_A;
    axiosInstance
      .get(`${host}${API.V2_STATUS_PATH}`)
      .then(({ data: { available } }) => {
        if (!available) {
          alertUser("Oyster is under maintenance. Please try again later.");
        }
        resolve(available);
      })
      .catch(err => {
        alertUser(err);
        reject(err);
      });
  });

const createUploadSession = (
  host,
  numChunks,
  genesisHash,
  storageLengthInYears
) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .post(`${host}${API.V2_UPLOAD_SESSIONS_PATH}`, {
        fileSizeBytes: FileProcessor.fileSizeFromNumChunks(numChunks),
        numChunks,
        genesisHash,
        betaIp: API.BROKER_NODE_B,
        storageLengthInYears,
        version: FileProcessor.CURRENT_VERSION
      })
      .then(({ data }) => {
        const { id: alphaSessionId, betaSessionId } = data;
        const { invoice } = data;
        resolve({ alphaSessionId, betaSessionId, invoice });
      })
      .catch(error => {
        alertUser(error);
        reject(error);
      });
  });

const sendChunksToBroker = (brokerUrl, chunks) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .put(brokerUrl, { chunks })
      .then(response => {
        console.log("SENT CHUNK TO BROKER: ", response);
        resolve(response);
      })
      .catch(error => {
        alertUser(error);
        console.log("ERROR SENDING CHUNK TO BROKER:", error);
        reject();
      });
  });

const sendFileToBroker = (brokerUrl, genesisHash, chunks) => {
  const batches = _.chunk(chunks, 5000);

  const batchRequests = batches.map(
    batch =>
      new Promise((resolve, reject) => {
        const chunksToParams = batch.map(chunk =>
          adaptChunkToParams(chunk, genesisHash)
        );
        Promise.all(chunksToParams).then(chunksParams => {
          sendChunksToBroker(brokerUrl, chunksParams).then(resolve);
        });
      })
  );

  return Promise.all(batchRequests).catch(alertUser);
};

const sendToAlphaBroker = (sessionId, chunks, genesisHash) =>
  new Promise((resolve, reject) => {
    sendFileToBroker(
      `${API.BROKER_NODE_A}${API.V2_UPLOAD_SESSIONS_PATH}/${sessionId}`,
      genesisHash,
      chunks
    ).then(resolve);
  }).catch(alertUser);

const sendToBetaBroker = (sessionId, chunks, genesisHash) =>
  new Promise((resolve, reject) => {
    sendFileToBroker(
      `${API.BROKER_NODE_B}${API.V2_UPLOAD_SESSIONS_PATH}/${sessionId}`,
      genesisHash,
      [...chunks].reverse()
    ).then(resolve);
  }).catch(alertUser);

const confirmPaid = (host, id) => {
  //change to confirmPaid
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`${host}${API.V2_UPLOAD_SESSIONS_PATH}/${id}`)
      .then(response => {
        resolve(response.data.paymentStatus);
      })
      .catch(error => {
        alertUser(error);
        reject(error);
      });
  });
};

const initializeUploadSession = (chunks, fileName, handle, retentionYears) => {
  const host = API.BROKER_NODE_A;
  const genesisHash = Datamap.genesisHash(handle);
  const numChunks = chunks.length;
  const storageLengthInYears = retentionYears;

  return createUploadSession(host, numChunks, genesisHash, storageLengthInYears)
    .then(({ alphaSessionId, betaSessionId, invoice }) => {
      return {
        alphaSessionId,
        betaSessionId,
        invoice,
        numberOfChunks: numChunks,
        handle,
        fileName,
        genesisHash,
        storageLengthInYears,
        host
      };
    })
    .catch(alertUser);
};

const getGasPrice = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`${API.GAS_PRICE}`)
      .then(response => {
        let priceInWei = response.data.medium_gas_price;
        let priceInGwei = Math.round(priceInWei / 1000000000);
        resolve(priceInGwei);
      })
      .catch(error => {
        alertUser(error);
        reject(error);
      });
  });
};

export default {
  uploadFile,
  checkStatus,
  confirmPaid,
  initializeUploadSession,
  getGasPrice
};
