import _ from "lodash";
import Encryption from "utils/encryption";
import Base64 from "base64-arraybuffer";

import Iota from "services/iota";
import { FILE } from "config";

const {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash,
  sha256,
  encrypt
} = Encryption;

const metaDataToIotaFormat = (object, handle) => {
  const metaDataString = JSON.stringify(object);
  const encryptedData = Encryption.encrypt(metaDataString, handle);
  const trytes = Iota.utils.toTrytes(encryptedData);

  return trytes;
};

const metaDataFromIotaFormat = (trytes, handle) => {
  const encryptedData = Iota.parseMessage(trytes);
  const decryptedData = Encryption.decrypt(encryptedData, handle);
  const metaData = JSON.parse(decryptedData);

  return metaData;
};

const encryptFile = (file, handle) =>
  readBlob(file).then(arrayBuffer => {
    const encodedData = Base64.encode(arrayBuffer);
    const encryptedData = Encryption.encrypt(encodedData, handle);

    return encryptedData;
  });

const chunkToIotaFormat = encryptedData => Iota.utils.toTrytes(encryptedData);

const chunkFromIotaFormat = (trytes, handle) => {
  const encryptedData = Iota.parseMessage(trytes);
  const encodedData = Encryption.decrypt(encryptedData, handle);
  const arrayBuffer = Base64.decode(encodedData);

  // console.log("[DOWNLOAD] TRYTES: ", trytes);
  // console.log("[DOWNLOAD] ENCRYPTED DATA: ", encryptedData);
  // console.log("[DOWNLOAD] ENCODED DATA: ", encodedData);
  // console.log("[DOWNLOAD] ORIGINAL DATA: ", new Uint8Array(arrayBuffer));
  return arrayBuffer;
};

const mergeArrayBuffers = arrayBuffers => {
  const totalLength = _.reduce(
    arrayBuffers,
    (acc, buff) => {
      return acc + buff.byteLength;
    },
    0
  );
  const mergedBuffer = new Uint8Array(totalLength);

  // This mutates mergedBuffer for efficiency.
  _.reduce(
    arrayBuffers,
    ({ mergedBuffer, idx }, buff) => {
      mergedBuffer.set(new Uint8Array(buff), idx);
      return { mergedBuffer, idx: idx + buff.byteLength };
    },
    { mergedBuffer, idx: 0 }
  );

  return mergedBuffer.buffer;
};

const chunkParamsGenerator = ({ idx, data, hash }) => {
  return { idx, data, hash };
};

const chunkGenerator = ({ idx, startingPoint, type }) => {
  return { idx, startingPoint, type };
};

const initializeUpload = file => {
  const numberOfChunks = createByteLocations(file.size).length;
  const handle = createHandle(file.name);
  const fileName = file.name;
  return { numberOfChunks, handle, fileName };
};

const createHandle = fileName => {
  const fileNameTrimmed = parseEightCharsOfFilename(fileName);
  const salt = getSalt(8);
  const primordialHash = getPrimordialHash();
  const handle = fileNameTrimmed + primordialHash + salt;

  return handle;
};

const createByteLocations = fileSizeBytes =>
  _.range(0, fileSizeBytes, FILE.CHUNK_BYTE_SIZE);

const createByteChunks = fileSizeBytes => {
  const metaDataChunk = chunkGenerator({
    idx: 0,
    startingPoint: null,
    type: FILE.CHUNK_TYPES.METADATA
  });

  // This returns an array with the starting byte pointers
  // ex: For a 2300 byte file it would return: [0, 500, 1000, 1500, 2000]
  const byteLocations = createByteLocations(fileSizeBytes);
  const fileContentChunks = _.map(byteLocations, (byte, index) => {
    return chunkGenerator({
      idx: index + 1,
      startingPoint: byte,
      type: FILE.CHUNK_TYPES.FILE_CONTENTS
    });
  });

  return [metaDataChunk, ...fileContentChunks];
};

const readBlob = blob =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(evt) {
      if (evt.target.readyState === FileReader.DONE) {
        const arrayBuffer = evt.target.result;
        resolve(arrayBuffer);
      }
    };
    reader.readAsArrayBuffer(blob);
  });

const metaDataToChunkParams = (metaData, idx, handle, genesisHash) =>
  chunkParamsGenerator({
    idx: idx,
    data: metaDataToIotaFormat(metaData, handle),
    hash: genesisHash
  });

const fileContentsToChunkParams = (data, idx, genesisHash) =>
  chunkParamsGenerator({
    idx: idx,
    data: chunkToIotaFormat(data),
    hash: genesisHash
  });

const createChunkParams = (
  chunk,
  sliceCutOffFn,
  fileContents,
  metaData,
  handle,
  genesisHash
) => {
  const { idx, startingPoint, type } = chunk;
  switch (type) {
    case FILE.CHUNK_TYPES.FILE_CONTENTS:
      const slice = fileContents.slice(
        startingPoint,
        sliceCutOffFn(startingPoint)
      );
      return fileContentsToChunkParams(slice, idx, genesisHash);
    default:
      return metaDataToChunkParams(metaData, idx, handle, genesisHash);
  }
};

const createMetaData = file => {
  const fileExtension = file.name.split(".").pop();
  const fileName = file.name;
  const fileSizeBytes = file.size;

  const numberOfChunks = createByteLocations(fileSizeBytes).length;
  return {
    fileName: fileName.substr(0, 500),
    ext: fileExtension,
    numberOfChunks
  };
};

export default {
  chunkFromIotaFormat,
  chunkParamsGenerator,
  chunkToIotaFormat,
  createByteChunks,
  createChunkParams,
  createMetaData,
  encryptFile,
  initializeUpload,
  mergeArrayBuffers,
  metaDataFromIotaFormat,
  metaDataToIotaFormat,
  readBlob
};
