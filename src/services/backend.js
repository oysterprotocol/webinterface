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

  const genesisHash = Encryption.sha256(handle);
  const metaData = FileProcessor.createMetaData(file);

  return FileProcessor.fileContentsToTrytes(file, handle).then(
    fileContentsInTrytes => {
      const byteChunks = FileProcessor.createByteChunks(
        fileContentsInTrytes.length
      );

      return createUploadSession(API.BROKER_NODE_A, file.size, genesisHash)
        .then(({ alphaSessionId, betaSessionId }) =>
          Promise.all([
            sendToAlphaBroker(
              alphaSessionId,
              byteChunks,
              fileContentsInTrytes,
              metaData,
              handle,
              genesisHash
            )
            // sendToBetaBroker(betaSessionId, byteChunks, fileContentsInTrytes, metaData, handle, genesisHash)
          ])
        )
        .then(() => {
          return {
            numberOfChunks: byteChunks.length,
            handle,
            fileName: file.name
          };
        });
    }
  );
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
        const { id: alphaSessionId, beta_session_id: betaSessionId } = data;
        resolve({ alphaSessionId, betaSessionId });
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
  const batches = _.chunk(byteChunks, API.CHUNKS_PER_REQUEST);
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
      `${API.BROKER_NODE_A}${API.V1_UPLOAD_SESSIONS_PATH}/${sessionId}`,
      fileContents,
      metaData,
      handle,
      genesisHash,
      byteChunks,
      byteLocation => byteLocation + FILE.CHUNK_BYTE_SIZE
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
      `${API.BROKER_NODE_B}${API.V1_UPLOAD_SESSIONS_PATH}/${sessionId}`,
      fileContents,
      metaData,
      handle,
      genesisHash,
      [...byteChunks].reverse(),
      byteLocation =>
        Math.min(fileContents.length, byteLocation + FILE.CHUNK_BYTE_SIZE)
    ).then(resolve);
  });

export default {
  uploadFile
};
