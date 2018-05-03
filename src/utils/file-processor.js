import CryptoJS from "crypto-js";
import _ from "lodash";
import Encryption from "utils/encryption";
import Base64 from "base64-arraybuffer";

import Iota from "../services/iota";
import { FILE, IOTA_API } from "../config";

const CHUNK_SIZE = Math.floor(0.7 * (2187 / 2)); // TODO: Optimize this.

const fileSizeFromNumChunks = numChunks => numChunks * CHUNK_SIZE;

const initializeUpload = file => {
  const handle = createHandle(file.name);
  return fileToChunks(file, handle, { withMeta: true }).then(chunks => {
    const fileName = file.name;
    const numberOfChunks = chunks.length;
    return { handle, fileName, numberOfChunks, chunks };
  });
};

const metaDataFromIotaFormat = (trytes, handle) => {
  const encryptedData = Iota.parseMessage(trytes);
  const decryptedData = Encryption.decrypt(encryptedData, handle);
  const metaData = JSON.parse(decryptedData);

  return metaData;
};

const createHandle = fileName => {
  const fileNameTrimmed = Encryption.parseEightCharsOfFilename(fileName);
  const salt = Encryption.getSalt(8);
  const primordialHash = Encryption.getPrimordialHash();
  const handle = fileNameTrimmed + primordialHash + salt;

  return handle;
};

const readBlob = blob =>
  new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onloadend = ({ target }) => resolve(target.result);
      reader.readAsArrayBuffer(blob);
    } catch (err) {
      reject(err);
    }
  });

const createMetaData = (fileName, numberOfChunks) => {
  const fileExtension = fileName.split(".").pop();

  const meta = {
    fileName: fileName.substr(0, 500),
    ext: fileExtension,
    numberOfChunks
  };

  return JSON.stringify(meta);
};

const parseMetaChunk = (chunk, handle) => {
  const chunkBytes = Iota.utils.fromTrytes(chunk.data);
  const metaJson = Encryption.decrypt(chunkBytes, handle);

  return JSON.parse(metaJson);
};

// Pipeline: file |> splitToChunks |> encrypt |> toTrytes
const fileToChunks = (file, handle, opts = {}) =>
  new Promise((resolve, reject) => {
    try {
      // Split into chunks.
      const chunksCount = Math.ceil(file.size / CHUNK_SIZE, CHUNK_SIZE);
      const chunks = [];

      let fileOffset = 0;
      for (let i = 0; i < chunksCount; i++) {
        chunks.push(file.slice(fileOffset, fileOffset + CHUNK_SIZE));
        fileOffset += CHUNK_SIZE;
      }

      Promise.all(chunks.map(readBlob)).then(chunks => {
        let encryptedChunks = chunks
          .map(byteArrayToWordArray)
          .map(chunk => Encryption.encrypt(chunk, handle))
          .map(Iota.utils.toTrytes)
          .map((data, idx) => ({ idx: idx + 1, data })); // idx because things will get jumbled

        if (opts.withMeta) {
          const metaChunk = createMetaData(file.name, chunksCount);
          const encryptedMeta = Encryption.encrypt(metaChunk, handle);
          const metaData = Iota.utils.toTrytes(encryptedMeta);

          encryptedChunks = [{ idx: 0, data: metaData }, ...encryptedChunks];
        }
        resolve(encryptedChunks);
      });
    } catch (err) {
      reject(err);
    }
  });

// Pipeline: chunks |> fromTrytes |> decrypt |> combineChunks
const chunksToFile = (chunks, handle) =>
  new Promise((resolve, reject) => {
    try {
      // ASC order.
      // NOTE: Cannot use `>` because JS treats 0 as null and doesn't work.
      chunks.sort((x, y) => x.idx - y.idx);

      const bytes = chunks
        .map(({ data }) => data)
        .map(Iota.utils.fromTrytes)
        .map(chunk => Encryption.decrypt(chunk, handle)) // treasure => null
        .map(wordArrayToByteArray)
        .join(""); // join removes nulls

      resolve(new Blob([bytes]));
    } catch (err) {
      reject(err);
    }
  });

// TODO: Switch to a different crypto lib where we don't need these?

const byteArrayToWordArray = ba => {
  let wa = [],
    i;
  for (i = 0; i < ba.length; i++) {
    wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
  }

  return CryptoJS.lib.WordArray.create(wa, ba.length);
};

const wordArrayToByteArray = (wordArray, length) => {
  if (
    wordArray.hasOwnProperty("sigBytes") &&
    wordArray.hasOwnProperty("words")
  ) {
    length = wordArray.sigBytes;
    wordArray = wordArray.words;
  }

  let result = [],
    bytes,
    i = 0;
  while (length > 0) {
    bytes = wordToByteArray(wordArray[i], Math.min(4, length));
    length -= bytes.length;
    result.push(bytes);
    i++;
  }
  return [].concat.apply([], result);
};

const wordToByteArray = (word, length) => {
  let ba = [],
    xFF = 0xff;
  if (length > 0) ba.push(word >>> 24);
  if (length > 1) ba.push((word >>> 16) & xFF);
  if (length > 2) ba.push((word >>> 8) & xFF);
  if (length > 3) ba.push(word & xFF);

  return ba;
};

export default {
  metaDataFromIotaFormat,
  initializeUpload,
  readBlob,
  fileSizeFromNumChunks,
  fileToChunks, // used just for testing.
  parseMetaChunk,
  chunksToFile
};
