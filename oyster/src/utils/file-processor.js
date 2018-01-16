import _ from "lodash";
import request from "request";
import {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash
} from "utils/encryption";

import { API } from "config";

const ENTROPY = "abc123";
const CHUNK_BYTE_SIZE = 30;

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
      `${API.HOST}${API.V1_UPLOAD_SESSIONS_PATH}`,
      {
        file_size_bytes: file.size,
        genesis_hash: createHandle(file.name)
      },
      (error, response, body) => {
        if (error) {
          return reject(error);
        }
        resolve(JSON.parse(response.body));
      }
    );
  });

const uploadFileToBrokerNodes = file => {
  const byteChunks = createByteChunks(file);

  Promise.all([
    sendToAlphaBroker(byteChunks, file),
    sendToBetaBroker(byteChunks, file)
  ]).then(() => {
    console.log("Upload complete! ", sentChunks);
  });
};

const createReader = onRead => {
  const reader = new FileReader();
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) {
      onRead(evt.target.result);
    }
  };
  return reader;
};

const sentChunks = {};
const sendChunkToNode = (chunkIdx, fileSlice, handle) => {
  if (!!sentChunks[chunkIdx]) {
    return;
  }

  // TODO: wrap this in promise and actually send the chunks to nodes
  const encryptedChunk = encrypt(fileSlice, handle);
  sentChunks[chunkIdx] = encryptedChunk;

  return encryptedChunk;
};

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

export default { createHandle, createByteChunks, createUploadSession };
