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
  const metaDataObject = JSON.parse(decryptedData);

  return metaDataObject;
};

const chunkToIotaFormat = (arrayBuffer, handle) => {
  const encodedData = Base64.encode(arrayBuffer);
  const encryptedData = Encryption.encrypt(encodedData, handle);
  const trytes = Iota.utils.toTrytes(encryptedData);

  // console.log("[UPLOAD] ORIGINAL DATA: ", new Uint8Array(arrayBuffer));
  // console.log("[UPLOAD] ENCODED DATA: ", encodedData);
  // console.log("[UPLOAD] ENCRYPTED DATA: ", encryptedData);
  // console.log("[UPLOAD] TRYTES: ", trytes);
  return trytes;
};

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

const metaDataToChunkParams = (metaDataObject, idx, handle, genesisHash) =>
  chunkParamsGenerator({
    idx: idx,
    data: metaDataToIotaFormat(metaDataObject, handle),
    hash: genesisHash
  });

const blobToChunkParams = (blob, idx, handle, genesisHash) =>
  new Promise((resolve, reject) => {
    readBlob(blob).then(arrayBuffer => {
      const chunk = chunkParamsGenerator({
        idx,
        data: chunkToIotaFormat(arrayBuffer, handle),
        hash: genesisHash
      });
      resolve(chunk);
    });
  });

const createChunkParams = (chunk, sliceCutOffFn, file, handle, genesisHash) => {
  const { idx, startingPoint, type } = chunk;
  switch (type) {
    case FILE.CHUNK_TYPES.FILE_CONTENTS:
      const blob = file.slice(startingPoint, sliceCutOffFn(startingPoint));
      return blobToChunkParams(blob, idx, handle, genesisHash);
    default:
      const metaDataObject = createMetaDataObject(file);
      return metaDataToChunkParams(metaDataObject, idx, handle, genesisHash);
  }
};

const createMetaDataObject = file => {
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
  blobToChunkParams,
  chunkFromIotaFormat,
  chunkParamsGenerator,
  chunkToIotaFormat,
  createByteChunks,
  createChunkParams,
  initializeUpload,
  mergeArrayBuffers,
  metaDataFromIotaFormat,
  metaDataToIotaFormat,
  readBlob
};
