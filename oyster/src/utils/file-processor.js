import _ from "lodash";
import request from "request";
import Encryption from "utils/encryption";
import { API } from "config";

const {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash,
  encrypt
} = Encryption;

const ENTROPY = "abc123";
const CHUNK_BYTE_SIZE = 30;

const uploadFileToBrokerNodes = file => {
  const byteChunks = createByteChunks(file);
  const handle = createHandle(file.name);

  return Promise.all([
    sendToAlphaBroker(byteChunks, file, handle),
    sendToBetaBroker(byteChunks, file, handle)
  ]);
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
  // ex: For a 150 byte file it would return: [0, 31, 62, 93, 124]
  const byteLocations = _.range(0, file.size, CHUNK_BYTE_SIZE + 1);
  const byteChunks = _.map(byteLocations, (byte, index) => {
    return { chunkIdx: index + 1, chunkStartingPoint: byte };
  });

  return byteChunks;
};

const createUploadSession = file =>
  new Promise((resolve, reject) => {
    request.post(
      {
        url: `${API.HOST}${API.V1_UPLOAD_SESSIONS_PATH}`,
        form: {
          file_size_bytes: 90,
          genesis_hash: "12345678hashy_hashsalty_salt"
        }
      },
      (error, response, body) => {
        if (error) {
          return reject(error);
        }
        resolve(JSON.parse(response.body));
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

const sendChunkToBroker = (chunkIdx, data, handle) =>
  new Promise((resolve, reject) => {
    const encryptedData = encrypt(data, handle);
    request.post(
      {
        url: `${API.HOST}${API.V1_UPLOAD_CHUNKS_PATH}`,
        form: {
          chunkIdx,
          data: encryptedData,
          genesis_hash: handle
        }
      },
      (error, response, body) => {
        if (error) {
          return reject(error);
        }
        resolve(JSON.parse(response.body));
      }
    );

    return encryptedData;
  });

const sendFileContentsToBroker = (file, handle, byteChunks, sliceCutOffFn) => {
  const chunkRequests = byteChunks.map(
    byte =>
      new Promise((resolve, reject) => {
        const { chunkIdx, chunkStartingPoint } = byte;
        const blob = file.slice(
          chunkStartingPoint,
          sliceCutOffFn(chunkStartingPoint)
        );

        const reader = createReader(fileSlice => {
          sendChunkToBroker(chunkIdx, fileSlice, handle).then(resolve);
        });
        reader.readAsBinaryString(blob);
      })
  );

  return Promise.all(chunkRequests);
};

const sendMetaDataToBroker = (file, handle) =>
  new Promise((resolve, reject) => {
    request.post(
      {
        url: `${API.HOST}${API.V1_UPLOAD_CHUNKS_PATH}`,
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

const sendToAlphaBroker = (byteChunks, file, handle) =>
  new Promise((resolve, reject) => {
    sendMetaDataToBroker(file, handle)
      .then(() =>
        sendFileContentsToBroker(
          file,
          handle,
          byteChunks,
          byteLocation => byteLocation + CHUNK_BYTE_SIZE
        )
      )
      .then(resolve);
  });

const sendToBetaBroker = (byteChunks, file, handle) =>
  new Promise((resolve, reject) => {
    sendFileContentsToBroker(file, handle, byteChunks.reverse(), byteLocation =>
      Math.min(file.size, byteLocation + CHUNK_BYTE_SIZE)
    )
      .then(() => sendMetaDataToBroker(file, handle))
      .then(resolve);
  });

const buildMetaDataPacket = (file, handle) => {
  const fileExtension = file.name.split(".").pop();
  const metaData = assembleMetaData(file.name, fileExtension);
  const encryptedMetaData = encrypt(metaData, handle);

  return encryptedMetaData;
};

const assembleMetaData = (name, extension) => {
  const metaData = { fname: name, ext: extension };
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
