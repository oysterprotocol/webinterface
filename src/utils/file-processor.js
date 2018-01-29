import _ from "lodash";
import axios from "axios";
import Encryption from "utils/encryption";
import { API, FILE } from "config";
import Base64 from "base64-arraybuffer";

const {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash,
  sha256,
  encrypt
} = Encryption;

const chunkGenerator = ({ idx, data, hash }) => {
  return { idx, data, hash };
};

const initializeUpload = file => {
  const numberOfChunks = createByteLocations(file.size).length;
  const handle = createHandle(file.name);
  const fileName = file.name;
  return { numberOfChunks, handle, fileName };
};

const uploadFileToBrokerNodes = (file, handle) => {
  const byteChunks = createByteChunks(file.size);
  const genesisHash = sha256(handle);

  return createUploadSession(file.size, genesisHash)
    .then(sessionId =>
      Promise.all([
        sendToAlphaBroker(sessionId, byteChunks, file, handle, genesisHash),
        sendToBetaBroker(sessionId, byteChunks, file, handle, genesisHash)
      ])
    )
    .then(() => {
      return { numberOfChunks: byteChunks.length, handle, fileName: file.name };
    });
};

const createHandle = fileName => {
  const fileNameTrimmed = parseEightCharsOfFilename(fileName);
  const salt = getSalt(8);
  const primordialHash = getPrimordialHash();
  const handle = fileNameTrimmed + primordialHash + salt;

  return handle;
};

const createByteLocations = fileSizeBytes =>
  _.range(0, fileSizeBytes, FILE.CHUNK_BYTE_SIZE + 1);

const createByteChunks = fileSizeBytes => {
  // This returns an array with the starting byte pointers
  // ex: For a 150 byte file it would return: [0, 1001, 2002, 3003, 4004]
  const byteLocations = createByteLocations(fileSizeBytes);
  const byteChunks = _.map(byteLocations, (byte, index) => {
    return { chunkIdx: index + 1, chunkStartingPoint: byte };
  });

  return byteChunks;
};

const createUploadSession = (fileSizeBytes, genesisHash) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${API.HOST}${API.V1_UPLOAD_SESSIONS_PATH}`, {
        file_size_bytes: fileSizeBytes,
        genesis_hash: genesisHash
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

const createReader = onRead => {
  const reader = new FileReader();
  reader.onloadend = function(evt) {
    if (evt.target.readyState === FileReader.DONE) {
      const arrayBuffer = evt.target.result;
      console.log("UPLOADING ARRAY BUFFER: ", arrayBuffer);
      const encoded = Base64.encode(arrayBuffer);
      onRead(encoded);
    }
  };
  return reader;
};

const sendChunkToBroker = (sessionId, chunkIdx, data, handle, genesisHash) =>
  new Promise((resolve, reject) => {
    console.log("RAW DATA: ", data);
    const encryptedData = encrypt(data, handle);
    console.log("CHUNK IDX: ", chunkIdx);
    console.log("ENCRYPTED DATA: ", encryptedData);
    axios
      .put(`${API.HOST}${API.V1_UPLOAD_SESSIONS_PATH}/${sessionId}`, {
        chunk: chunkGenerator({
          idx: chunkIdx,
          data: encryptedData,
          hash: genesisHash
        })
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
  genesisHash,
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
          sendChunkToBroker(
            sessionId,
            chunkIdx,
            fileSlice,
            handle,
            genesisHash
          ).then(resolve);
        });
        reader.readAsArrayBuffer(blob);
      })
  );

  return Promise.all(chunkRequests);
};

const sendMetaDataToBroker = (sessionId, file, handle, genesisHash) =>
  new Promise((resolve, reject) => {
    axios
      .put(`${API.HOST}${API.V1_UPLOAD_SESSIONS_PATH}/${sessionId}`, {
        chunk: chunkGenerator({
          idx: 0,
          data: buildMetaDataPacket(file, handle),
          hash: genesisHash
        })
      })
      .then(({ data }) => {
        console.log("METADATA TO BROKER SUCCESS: ", data);
        resolve(data);
      })
      .catch(error => {
        console.log("METADATA TO BROKER ERROR: ", error);
        reject(error);
      });
  });

const sendToAlphaBroker = (sessionId, byteChunks, file, handle, genesisHash) =>
  new Promise((resolve, reject) => {
    sendMetaDataToBroker(sessionId, file, handle, genesisHash)
      .then(() =>
        sendFileContentsToBroker(
          sessionId,
          file,
          handle,
          genesisHash,
          byteChunks,
          byteLocation => byteLocation + FILE.CHUNK_BYTE_SIZE
        )
      )
      .then(resolve);
  });

const sendToBetaBroker = (sessionId, byteChunks, file, handle, genesisHash) =>
  new Promise((resolve, reject) => {
    sendFileContentsToBroker(
      sessionId,
      file,
      handle,
      genesisHash,
      [...byteChunks].reverse(),
      byteLocation => Math.min(file.size, byteLocation + FILE.CHUNK_BYTE_SIZE)
    )
      .then(() => sendMetaDataToBroker(sessionId, file, handle, genesisHash))
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
  initializeUpload,
  uploadFileToBrokerNodes,
  sendChunkToBroker,
  createByteChunks,
  createUploadSession,
  buildMetaDataPacket
};
