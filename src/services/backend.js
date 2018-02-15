import _ from "lodash";
import axios from "axios";

import FileProcessor from "utils/file-processor";
import Encryption from "utils/encryption";
import { API, FILE } from "config";

const axiosInstance = axios.create({
  timeout: 200000
});

const uploadFile = (file, handle) => {
  console.log("UPLOADING FILE TO BROKER NODES");
  const byteChunks = FileProcessor.createByteChunks(file.size);
  const genesisHash = Encryption.sha256(handle);
  return Promise.all([
    createUploadSession(API.BROKER_NODE_A, file.size, genesisHash)
    // createUploadSession(API.BROKER_NODE_B, file.size, genesisHash)
  ])
    .then(([alphaSessionId, betaSessionId]) =>
      Promise.all([
        sendToAlphaBroker(alphaSessionId, byteChunks, file, handle, genesisHash)
        // sendToBetaBroker(betaSessionId, byteChunks, file, handle, genesisHash)
      ])
    )
    .then(() => {
      return { numberOfChunks: byteChunks.length, handle, fileName: file.name };
    });
};

const createUploadSession = (host, fileSizeBytes, genesisHash) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .post(`${host}${API.V1_UPLOAD_SESSIONS_PATH}`, {
        file_size_bytes: fileSizeBytes,
        genesis_hash: genesisHash,
        beta_brokernode_ip: API.BROKER_NODE_B
      })
      .then(({ data }) => {
        console.log("UPLOAD SESSION SUCCESS: ", data);
        const { id: sessionId } = data;
        resolve(sessionId);
      })
      .catch(error => {
        console.log("UPLOAD SESSION ERROR: ", error);
        reject(error);
      });
  });

const sendChunksToBroker = (host, sessionId, chunks) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .put(`${host}${API.V1_UPLOAD_SESSIONS_PATH}/${sessionId}`, { chunks })
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
  host,
  sessionId,
  file,
  handle,
  genesisHash,
  byteChunks,
  sliceCutOffFn
) => {
  const batches = _.chunk(byteChunks, API.CHUNKS_PER_REQUEST);
  const batchRequests = batches.map(
    batch =>
      new Promise((resolve, reject) => {
        const chunksToParams = batch.map(chunk =>
          FileProcessor.createChunkParams(
            chunk,
            sliceCutOffFn,
            file,
            handle,
            genesisHash
          )
        );
        Promise.all(chunksToParams).then(arrayOfChunks => {
          sendChunksToBroker(host, sessionId, arrayOfChunks).then(resolve);
        });
      })
  );

  return Promise.all(batchRequests);
};

const sendToAlphaBroker = (sessionId, byteChunks, file, handle, genesisHash) =>
  new Promise((resolve, reject) => {
    sendFileToBroker(
      API.BROKER_NODE_A,
      sessionId,
      file,
      handle,
      genesisHash,
      byteChunks,
      byteLocation => byteLocation + FILE.CHUNK_BYTE_SIZE
    ).then(resolve);
  });

const sendToBetaBroker = (sessionId, byteChunks, file, handle, genesisHash) =>
  new Promise((resolve, reject) => {
    sendFileToBroker(
      API.BROKER_NODE_B,
      sessionId,
      file,
      handle,
      genesisHash,
      [...byteChunks].reverse(),
      byteLocation => Math.min(file.size, byteLocation + FILE.CHUNK_BYTE_SIZE)
    ).then(resolve);
  });

export default {
  uploadFile
};
