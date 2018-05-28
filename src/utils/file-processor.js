import Encryption from "utils/encryption";
import _ from "lodash";
import forge from "node-forge";

import Iota from "../services/iota";

const CHUNK_SIZE = 1024;
const fileSizeFromNumChunks = numChunks => numChunks * CHUNK_SIZE;

// DO NOT CHANGE THIS! It will  break encoding/decoding  meta chunks.
const VERSION_BYTES = 4;
const CURRENT_VERSION = 1;

const initializeUpload = file => {
  const handle = createHandle(file.name);
  return fileToChunks(file, handle, { withMeta: true }).then(chunks => {
    const fileName = file.name;
    const numberOfChunks = chunks.length;
    return { handle, fileName, numberOfChunks, chunks };
  });
};

const metaDataFromIotaFormat = (trytes, handle) => {
  const handleInBytes = Encryption.bytesFromHandle(handle);
  const stopperRemoved = Iota.removeStopperTryteAndPadding(trytes);
  const encryptedData = Iota.utils.fromTrytes(
    Iota.addPaddingIfOdd(stopperRemoved)
  );
  const { version, meta: encryptedMeta } = parseMetaVersion(encryptedData);
  const decryptedData = Encryption.decryptChunk(handleInBytes, encryptedMeta);

  return JSON.parse(decryptedData);
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
    fileName: fileName.substring(0, 500),
    ext: fileExtension,
    numberOfChunks
  };

  return JSON.stringify(meta);
};

const addVersionToMeta = metaStr => {
  const typedVersion = new DataView(new ArrayBuffer(VERSION_BYTES));
  typedVersion.setUint32(0, CURRENT_VERSION);
  const buf = new forge.util.ByteBuffer(typedVersion.buffer);
  return `${buf.bytes()}${metaStr}`;
};

const parseMetaVersion = metaRaw => {
  const rawVersion = metaRaw.substring(0, VERSION_BYTES);
  const meta = metaRaw.substring(VERSION_BYTES);
  const bytes = forge.util.binary.raw.decode(rawVersion);
  const version = (new DataView(bytes.buffer)).getUint32(0);

  return { version, meta };
};

// Pipeline: file |> splitToChunks |> encrypt |> toTrytes
const fileToChunks = (file, handle, opts = {}) =>
  new Promise((resolve, reject) => {
    try {
      // Split into chunks.
      const chunksCount = Math.ceil(file.size / CHUNK_SIZE, CHUNK_SIZE);
      const chunks = [];
      const handleInBytes = Encryption.bytesFromHandle(handle);

      let fileOffset = 0;
      for (let i = 0; i < chunksCount; i++) {
        chunks.push(file.slice(fileOffset, fileOffset + CHUNK_SIZE));
        fileOffset += CHUNK_SIZE;
      }

      Promise.all(chunks.map(readBlob)).then(arrayBuffer => {
        let encryptedChunks = arrayBuffer
          .map(arrayBufferToString)
          .map((binaryString, idx) =>
            Encryption.encryptChunk(handleInBytes, idx + 1, binaryString)
          )
          .map(Iota.utils.toTrytes)
          .map(Iota.addStopperTryte)
          .map((data, idx) => ({ idx: idx + 1, data })); // idx because things will get jumbled

        if (opts.withMeta) {
          const metaChunk = createMetaData(file.name, chunksCount);
          const encryptedMeta = Encryption.encryptChunk(
            handleInBytes,
            0,
            metaChunk
          );

          const versionedMeta = addVersionToMeta(encryptedMeta);
          const trytedMetaData = Iota.addStopperTryte(
            Iota.utils.toTrytes(versionedMeta)
          );

          encryptedChunks = [
            { idx: 0, data: trytedMetaData },
            ...encryptedChunks
          ];
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
      const handleInBytes = Encryption.bytesFromHandle(handle);

      const bytes = chunks
        .map(({ data }) => data)
        .map(Iota.removeStopperTryteAndPadding)
        .map(Iota.addPaddingIfOdd)
        .map(Iota.utils.fromTrytes)
        .map(data => Encryption.decryptChunk(handleInBytes, data))
        .join(""); // join removes nulls

      resolve(new Blob([new Uint8Array(string2Bin(bytes))]));
    } catch (err) {
      reject(err);
    }
  });

function arrayBufferToString(buffer) {
  return binaryToString(
    String.fromCharCode.apply(
      null,
      Array.prototype.slice.apply(new Uint8Array(buffer))
    )
  );
}

function binaryToString(binary) {
  let error;

  try {
    return decodeURIComponent(escape(binary));
  } catch (_error) {
    error = _error;
    if (error instanceof URIError) {
      return binary;
    } else {
      throw error;
    }
  }
}

const string2Bin = str => _.map(str, c => c.charCodeAt(0));

export default {
  metaDataFromIotaFormat,
  initializeUpload,
  readBlob,
  fileSizeFromNumChunks,
  fileToChunks, // used just for testing.
  chunksToFile
};
