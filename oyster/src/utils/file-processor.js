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

  return Promise.all([
    sendToAlphaBroker(byteChunks, file),
    sendToBetaBroker(byteChunks, file)
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
    return { chunkIdx: index, chunkStartingPoint: byte };
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

const sendChunkToNode = (chunkIdx, data, handle) =>
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

const chunkFile = (file, byteChunks, sliceCutOffFn) => {
  const handle = createHandle(file.name);

  return byteChunks.map(byte => {
    const { chunkIdx, chunkStartingPoint } = byte;
    const blob = file.slice(
      chunkStartingPoint,
      sliceCutOffFn(chunkStartingPoint)
    );

    const reader = createReader(fileSlice => {
      sendChunkToNode(chunkIdx, fileSlice, handle);
    });
    return reader.readAsBinaryString(blob);
  });
};

const sendToAlphaBroker = (byteChunks, file) =>
  new Promise((resolve, reject) => {
    const blobs = chunkFile(
      file,
      byteChunks,
      byteLocation => byteLocation + CHUNK_BYTE_SIZE
    );
    resolve(blobs);
  });

const sendToBetaBroker = (byteChunks, file) =>
  new Promise((resolve, reject) => {
    const blobs = chunkFile(file, byteChunks.reverse(), byteLocation =>
      Math.min(file.size, byteLocation + CHUNK_BYTE_SIZE)
    );
    resolve(blobs);
  });

const buildMetaDataPacket = (name, extension, handle) => {
  const metaData = assembleMetaData(name, extension);
  const encryptedMetaData = encrypt(metaData, handle);

  return encryptedMetaData;
};

const assembleMetaData = (name, extension) => {
  const metaData = { fname: name, ext: extension };
  return JSON.stringify(metaData);
};

export default {
  uploadFileToBrokerNodes,
  sendChunkToNode,
  createHandle,
  createByteChunks,
  createUploadSession,
  buildMetaDataPacket
};
