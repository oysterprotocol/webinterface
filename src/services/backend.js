import _ from "lodash";
import axios from "axios";

import FileProcessor from "utils/file-processor";
import Encryption from "utils/encryption";
import { API, IOTA_API } from "config";

const axiosInstance = axios.create({
  timeout: 200000
});

const uploadFile = (chunks, fileName, handle) => {
  console.log("UPLOADING FILE TO BROKER NODES");

  const genesisHash = Encryption.genesisHash(handle);
  const numChunks = chunks.length;
  const metaData = FileProcessor.createMetaData(fileName, numChunks);
  // ALREADY HAVE CHUNKS!!! Delete this!!!
  const byteChunks = FileProcessor.createByteChunks(numChunks);
  const storageLengthInYears = 999; /*@TODO make this a real thing*/

  return createUploadSession(
    API.BROKER_NODE_A,
    numChunks, // numCHunks
    genesisHash,
    storageLengthInYears
  )
    .then(({ alphaSessionId, betaSessionId }) =>
      Promise.all([
        sendToAlphaBroker(
          alphaSessionId,
          byteChunks,
          data,
          metaData,
          handle,
          genesisHash
        ),
        sendToBetaBroker(
          betaSessionId,
          byteChunks,
          data,
          metaData,
          handle,
          genesisHash
        )
      ])
    )
    .then(() => {
      return {
        numberOfChunks: byteChunks.length,
        handle,
        fileName
      };
    });
};

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
        storageLengthInYears
      })
      .then(({ data }) => {
        console.log("UPLOAD SESSION SUCCESS: ", data);
        const { id: alphaSessionId, betaSessionId } = data;
        const { invoice: invoice } = data;
        resolve({ alphaSessionId, betaSessionId, invoice });
      })
      .catch(error => {
        console.log("UPLOAD SESSION ERROR: ", error);
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
        console.log("ERROR SENDING CHUNK TO BROKER:", error);
        reject();
      });
  });

const sendFileToBroker = (
  brokerUrl,
  fileContents,
  metaData,
  handle,
  genesisHash,
  byteChunks,
  sliceCutOffFn
) => {
  const batches = [_.slice(byteChunks, 0, byteChunks.length)];

  const batchRequests = batches.map(
    batch =>
      new Promise((resolve, reject) => {
        const chunksToParams = batch.map(chunk =>
          FileProcessor.createChunkParams(
            chunk,
            sliceCutOffFn,
            fileContents,
            metaData,
            handle,
            genesisHash
          )
        );
        Promise.all(chunksToParams).then(chunksParams => {
          sendChunksToBroker(brokerUrl, chunksParams).then(resolve);
        });
      })
  );

  return Promise.all(batchRequests);
};

const sendToAlphaBroker = (
  sessionId,
  byteChunks,
  fileContents,
  metaData,
  handle,
  genesisHash
) =>
  new Promise((resolve, reject) => {
    sendFileToBroker(
      `${API.BROKER_NODE_A}${API.V2_UPLOAD_SESSIONS_PATH}/${sessionId}`,
      fileContents,
      metaData,
      handle,
      genesisHash,
      byteChunks,
      byteLocation => byteLocation + IOTA_API.MESSAGE_LENGTH
    ).then(resolve);
  });

const sendToBetaBroker = (
  sessionId,
  byteChunks,
  fileContents,
  metaData,
  handle,
  genesisHash
) =>
  new Promise((resolve, reject) => {
    sendFileToBroker(
      `${API.BROKER_NODE_B}${API.V2_UPLOAD_SESSIONS_PATH}/${sessionId}`,
      fileContents,
      metaData,
      handle,
      genesisHash,
      [...byteChunks].reverse(),
      byteLocation =>
        Math.min(fileContents.length, byteLocation + IOTA_API.MESSAGE_LENGTH)
    ).then(resolve);
  });

export default {
  uploadFile
};
