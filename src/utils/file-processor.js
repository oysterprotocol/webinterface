import _ from "lodash";
import Encryption from "utils/encryption";
import Base64 from "base64-arraybuffer";

import Iota from "../services/iota";
import { FILE, IOTA_API } from "../config";

const CHUNK_SIZE = Math.floor(0.7 * (2187 / 2)); // TODO: Optimize this.

const metaDataToIotaFormat = (object, handle) => {
  const metaDataString = JSON.stringify(object);
  const encryptedData = Encryption.encryptMetaData(metaDataString, handle);
  const trytes = Iota.utils.toTrytes(encryptedData);

  return trytes;
};

const metaDataFromIotaFormat = (trytes, handle) => {
  const encryptedData = Iota.parseMessage(trytes);
  const decryptedData = Encryption.decryptMetaData(encryptedData, handle);
  const metaData = JSON.parse(decryptedData);

  return metaData;
};

const encryptFile = (file, handle) =>
  readBlob(file).then(arrayBuffer => {
    const bytes = new Uint8Array(arrayBuffer);
    const encryptedData = Encryption.encrypt(bytes, handle);
    const trytes = Iota.utils.toTrytes(encryptedData);

    // console.log("[UPLOAD] ENCRYPTED FILE: ", trytes);
    return trytes;
  });

const decryptFile = (trytes, handle) => {
  // console.log("[DOWNLOAD] DECRYPTED FILE: ", trytes);
  const encryptedData = Iota.parseMessage(trytes);
  const decryptedData = Encryption.decrypt(encryptedData, handle);

  return decryptedData;
};

const chunkParamsGenerator = ({ idx, data, hash }) => {
  return { idx, data, hash };
};

const chunkGenerator = ({ idx, startingPoint, type }) => {
  return { idx, startingPoint, type };
};

const initializeUpload = file => {
  const handle = createHandle(file.name);
  return encryptFile(file, handle).then(data => {
    const numberOfChunks = createByteLocations(data.length).length;
    return { handle, fileName: file.name, numberOfChunks, data };
  });
};

const createHandle = fileName => {
  const fileNameTrimmed = Encryption.parseEightCharsOfFilename(fileName);
  const salt = Encryption.getSalt(8);
  const primordialHash = Encryption.getPrimordialHash();
  const handle = fileNameTrimmed + primordialHash + salt;

  return handle;
};

const createByteLocations = fileSizeBytes =>
  _.range(0, fileSizeBytes, IOTA_API.MESSAGE_LENGTH);

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
    reader.onloadend = evt => resolve(reader.result);
    reader.readAsText(blob);
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
    data,
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

const createMetaData = (fileName, fileSizeBytes) => {
  const fileExtension = fileName.split(".").pop();
  const numberOfChunks = createByteLocations(fileSizeBytes).length;

  return {
    fileName: fileName.substr(0, 500),
    ext: fileExtension,
    numberOfChunks
  };
};

const fileToChunks = (file, handle) =>
  new Promise((resolve, reject) => {
    // Split into chunks.
    const chunks = [];

    const chunksCount = Math.ceil(file.size / CHUNK_SIZE, CHUNK_SIZE);
    let fileOffset = 0;
    console.log(CHUNK_SIZE);
    for (var i = 0; i < chunksCount; i++) {
      chunks.push(file.slice(fileOffset, fileOffset + CHUNK_SIZE));
      fileOffset += CHUNK_SIZE;
    }

    Promise.all(chunks.map(readBlob)).then(
      chunks =>
        chunks
          .map(chunk => Encryption.encrypt(chunk, handle))
          // .map(Iota.utils.toTrytes)
          // .map(Iota.utils.fromTrytes)
          .map(chunk => Encryption.decrypt(chunk, handle))
      // .forEach(console.log)
    );
  });

export default {
  chunkParamsGenerator,
  createByteChunks,
  createChunkParams,
  createMetaData,
  decryptFile,
  initializeUpload,
  metaDataFromIotaFormat,
  metaDataToIotaFormat,
  readBlob,

  fileToChunks
};
