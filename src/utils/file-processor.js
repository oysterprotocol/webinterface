import _ from "lodash";
import Encryption from "utils/encryption";
import Base64 from "base64-arraybuffer";

import Iota from "../services/iota";
import { FILE, IOTA_API } from "../config";

const CHUNK_SIZE = Math.floor(0.7 * (2187 / 2)); // TODO: Optimize this.

const fileSizeFromNumChunks = numChunks => numChunks * CHUNK_SIZE;

const decryptFile = (trytes, handle) => {
  // console.log("[DOWNLOAD] DECRYPTED FILE: ", trytes);
  const encryptedData = Iota.parseMessage(trytes);
  const decryptedData = Encryption.decrypt(encryptedData, handle);

  return decryptedData;
};

const initializeUpload = file => {
  const handle = createHandle(file.name);
  return fileToChunks(file, handle, { withMeta: true }).then(chunks => {
    const fileName = file.name;
    const numberOfChunks = chunks.length;
    return { handle, fileName, numberOfChunks, chunks };
  });
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
      reader.readAsText(blob); // this outputs a base64 encoded string
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

// Pipeline: file |> splitToChunks |> encrypt |> toTrytes
const fileToChunks = (file, handle, opts = {}) =>
  new Promise((resolve, reject) => {
    try {
      // Split into chunks.
      const chunksCount = Math.ceil(file.size / CHUNK_SIZE, CHUNK_SIZE);
      const chunks = opts.withMeta
        ? [createMetaData(file.name, chunksCount)]
        : [];

      let fileOffset = 0;
      for (let i = 0; i < chunksCount; i++) {
        chunks.push(file.slice(fileOffset, fileOffset + CHUNK_SIZE));
        fileOffset += CHUNK_SIZE;
      }

      Promise.all(chunks.map(readBlob)).then(chunks => {
        const encryptedChunks = chunks
          .map(chunk => Encryption.encrypt(chunk, handle))
          .map(Iota.utils.toTrytes)
          .map((data, idx) => ({ idx, data })); // idx because things will get jumbled

        resolve(encryptedChunks);
      });
    } catch (err) {
      reject(err);
    }
  });

// Pipeline: chunks |> fromTrytes |> decrypt |> combineChunks
const chunksToFile = (chunks, handle, opts = {}) =>
  new Promise((resolve, reject) => {
    try {
      // Remove metachunk
      if (opts.withMeta) chunks.splice(0, 1);

      // ASC order.
      // NOTE: Cannot use `>=` because JS treats 0 as null and doesn't work.
      chunks.sort((x, y) => x.idx - y.idx);

      const bytes = chunks
        .map(({ data }) => data)
        .map(Iota.utils.fromTrytes)
        .map(chunk => Encryption.decrypt(chunk, handle)) // treasure => null
        .join(""); // join removes nulls

      resolve(new Blob([bytes]));
    } catch (err) {
      console.log("IN HEEERRRR");
      reject(err);
    }
  });

export default {
  decryptFile,

  initializeUpload,
  readBlob,
  fileSizeFromNumChunks,
  fileToChunks, // used just for testing.
  chunksToFile
};
