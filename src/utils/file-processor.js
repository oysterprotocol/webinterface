import _ from "lodash";
import request from "request";
import axios from "axios";
import Encryption from "utils/encryption";
import { API, FILE } from "config";

const {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash,
  encrypt
} = Encryption;

const ENTROPY = "abc123";

const uploadFileToBrokerNodes = file => {
  const byteChunks = createByteChunks(file);
  const handle = createHandle(file.name);

  return createUploadSession(file, handle)
    .then(({ genesisHash, sessionId }) =>
      Promise.all([
        sendToAlphaBroker(sessionId, byteChunks, file, handle),
        sendToBetaBroker(sessionId, byteChunks, file, handle)
      ])
    )
    .then(() => {
      return { numberOfChunks: byteChunks.length, handle };
    });
};

const createHandle = fileName => {
  const fileNameTrimmed = parseEightCharsOfFilename(fileName);
  const salt = getSalt(8);
  const primordialHash = getPrimordialHash(ENTROPY);
  const handle = fileNameTrimmed + primordialHash + salt;

  return handle;
};

const createByteChunks = file => {
  // This returns an array with the starting byte pointers
  // ex: For a 150 byte file it would return: [0, 1001, 2002, 3003, 4004]
  const byteLocations = _.range(0, file.size, FILE.CHUNK_BYTE_SIZE + 1);
  const byteChunks = _.map(byteLocations, (byte, index) => {
    return { chunkIdx: index + 1, chunkStartingPoint: byte };
  });

  return byteChunks;
};

const createUploadSession = (file, handle) =>
  new Promise((resolve, reject) => {
    request.post(
      {
        url: `${API.HOST}${API.V1_UPLOAD_SESSIONS_PATH}`,
        form: {
          file_size_bytes: file.size,
          genesis_hash: handle
        }
      },
      (error, response, uploadSession) => {
        if (error) {
          console.log("UPLOAD SESSION ERROR: ", error);
          resolve();
          // TODO: uncomment this
          // return reject(error);
        } else {
          const { genesis_hash: genesisHash, id: sessionId } = JSON.parse(
            uploadSession
          );
          resolve({ genesisHash, sessionId });
        }
      }
    );
  });

const createReader = onRead => {
  const reader = new FileReader();
  reader.onloadend = function(evt) {
    if (evt.target.readyState === FileReader.DONE) {
      onRead(evt.target.result);
    }
  };
  return reader;
};

const sendChunkToBroker = (sessionId, chunkIdx, data, handle) =>
  new Promise((resolve, reject) => {
    const encryptedData = encrypt(data, handle);
    axios
      .put(`${API.HOST}${API.V1_UPLOAD_SESSIONS_PATH}/${sessionId}`, {
        chunk: {
          idx: chunkIdx,
          data: encryptedData,
          hash: handle
        }
      })
      .then(response => {
        console.log("SENT CHUNK TO BROKER: ", response);
        resolve(response);
      })
      .catch(error => {
        console.log("ERROR SENDING CHUNK TO BROKER:", error);
        reject();
      });
  });

const sendFileContentsToBroker = (
  sessionId,
  file,
  handle,
  byteChunks,
  sliceCutOffFn
) => {
  const chunkRequests = byteChunks.map(
    byte =>
      new Promise((resolve, reject) => {
        const { chunkIdx, chunkStartingPoint } = byte;
        const blob = file.slice(
          chunkStartingPoint,
          sliceCutOffFn(chunkStartingPoint)
        );

        const reader = createReader(fileSlice => {
          sendChunkToBroker(sessionId, chunkIdx, fileSlice, handle).then(
            resolve
          );
        });
        reader.readAsBinaryString(blob);
      })
  );

  return Promise.all(chunkRequests);
};

const sendMetaDataToBroker = (sessionId, file, handle) =>
  new Promise((resolve, reject) => {
    request.put(
      {
        url: `${API.HOST}${API.V1_UPLOAD_SESSIONS_PATH}/${sessionId}`,
        form: {
          chunkIdx: 0,
          data: buildMetaDataPacket(file, handle),
          genesis_hash: handle
        }
      },
      (error, response, body) => {
        if (error) {
          console.log("ERROR: ", error);
          // TODO: uncomment this out
          // return reject(error);
        }
        resolve();
      }
    );
  });

const sendToAlphaBroker = (sessionId, byteChunks, file, handle) =>
  new Promise((resolve, reject) => {
    sendMetaDataToBroker(sessionId, file, handle)
      .then(() =>
        sendFileContentsToBroker(
          sessionId,
          file,
          handle,
          byteChunks,
          byteLocation => byteLocation + FILE.CHUNK_BYTE_SIZE
        )
      )
      .then(resolve);
  });

const sendToBetaBroker = (sessionId, byteChunks, file, handle) =>
  new Promise((resolve, reject) => {
    sendFileContentsToBroker(
      sessionId,
      file,
      handle,
      [...byteChunks].reverse(),
      byteLocation => Math.min(file.size, byteLocation + FILE.CHUNK_BYTE_SIZE)
    )
      .then(() => sendMetaDataToBroker(sessionId, file, handle))
      .then(resolve);
  });

const buildMetaDataPacket = (file, handle) => {
  const fileExtension = file.name.split(".").pop();
  const metaData = assembleMetaData(file.name, fileExtension);
  const encryptedMetaData = encrypt(metaData, handle);

  return encryptedMetaData;
};

const assembleMetaData = (name, extension) => {
  const shortenedName = name.substr(0, 500);
  const metaData = { filename: shortenedName, ext: extension };
  return JSON.stringify(metaData);
};

export default {
  uploadFileToBrokerNodes,
  sendChunkToBroker,
  createHandle,
  createByteChunks,
  createUploadSession,
  buildMetaDataPacket
};
