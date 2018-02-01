import _ from "lodash";
import axios from "axios";
import Encryption from "utils/encryption";
import Iota from "services/iota";
import { API, FILE } from "config";
import Base64 from "base64-arraybuffer";

const {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash,
  sha256,
  encrypt
} = Encryption;

const axiosInstance = axios.create({
  timeout: 100000,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

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
  return _.reduce(
    arrayBuffers,
    (result, arrayBuffer) => {
      const appendedArrayBuffer = new Uint8Array(
        result.byteLength + arrayBuffer.byteLength
      );
      appendedArrayBuffer.set(new Uint8Array(result), 0);
      appendedArrayBuffer.set(new Uint8Array(arrayBuffer), result.byteLength);
      return appendedArrayBuffer.buffer;
    },
    new ArrayBuffer()
  );
};

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
  console.log("UPLOADING FILE TO BROKER NODES");
  const byteChunks = createByteChunks(file.size);
  const genesisHash = sha256(handle);

  return Promise.all([
    createUploadSession(API.BROKER_NODE_A, file.size, genesisHash),
    createUploadSession(API.BROKER_NODE_B, file.size, genesisHash)
  ])
    .then(([alphaSessionId, betaSessionId]) =>
      Promise.all([
        sendToAlphaBroker(
          alphaSessionId,
          byteChunks,
          file,
          handle,
          genesisHash
        ),
        sendToBetaBroker(betaSessionId, byteChunks, file, handle, genesisHash)
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
  _.range(0, fileSizeBytes, FILE.CHUNK_BYTE_SIZE);

const createByteChunks = fileSizeBytes => {
  // This returns an array with the starting byte pointers
  // ex: For a 150 byte file it would return: [0, 1001, 2002, 3003, 4004]
  const byteLocations = createByteLocations(fileSizeBytes);
  const byteChunks = _.map(byteLocations, (byte, index) => {
    return { chunkIdx: index + 1, chunkStartingPoint: byte };
  });

  return byteChunks;
};

const createUploadSession = (host, fileSizeBytes, genesisHash) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .post(`${host}${API.V1_UPLOAD_SESSIONS_PATH}`, {
        file_size_bytes: fileSizeBytes,
        genesis_hash: genesisHash,
        beta_brokernode_ip: API.BROKER_NODE_B
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
      onRead(arrayBuffer);
    }
  };
  return reader;
};

const sendChunkToBroker = (
  host,
  sessionId,
  chunkIdx,
  arrayBuffer,
  handle,
  genesisHash
) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .put(`${host}${API.V1_UPLOAD_SESSIONS_PATH}/${sessionId}`, {
        chunk: chunkGenerator({
          idx: chunkIdx,
          data: chunkToIotaFormat(arrayBuffer, handle),
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
  host,
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

        const reader = createReader(arrayBuffer => {
          sendChunkToBroker(
            host,
            sessionId,
            chunkIdx,
            arrayBuffer,
            handle,
            genesisHash
          ).then(resolve);
        });
        reader.readAsArrayBuffer(blob);
      })
  );

  return Promise.all(chunkRequests);
};

const sendMetaDataToBroker = (host, sessionId, file, handle, genesisHash) =>
  new Promise((resolve, reject) => {
    const metaDataObject = buildMetaDataPacket(file);
    axiosInstance
      .put(`${host}${API.V1_UPLOAD_SESSIONS_PATH}/${sessionId}`, {
        chunk: chunkGenerator({
          idx: 0,
          data: metaDataToIotaFormat(metaDataObject, handle),
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
    sendMetaDataToBroker(
      API.BROKER_NODE_A,
      sessionId,
      file,
      handle,
      genesisHash
    )
      .then(() =>
        sendFileContentsToBroker(
          API.BROKER_NODE_A,
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
      API.BROKER_NODE_B,
      sessionId,
      file,
      handle,
      genesisHash,
      [...byteChunks].reverse(),
      byteLocation => Math.min(file.size, byteLocation + FILE.CHUNK_BYTE_SIZE)
    )
      .then(() =>
        sendMetaDataToBroker(
          API.BROKER_NODE_B,
          sessionId,
          file,
          handle,
          genesisHash
        )
      )
      .then(resolve);
  });

const buildMetaDataPacket = file => {
  const fileExtension = file.name.split(".").pop();
  return assembleMetaData(file.name, fileExtension, file.size);
};

const assembleMetaData = (name, extension, fileSizeBytes) => {
  const shortenedName = name.substr(0, 500);
  const numberOfChunks = createByteLocations(fileSizeBytes).length;
  return { fileName: shortenedName, ext: extension, numberOfChunks };
};

export default {
  initializeUpload,
  uploadFileToBrokerNodes,
  sendChunkToBroker,
  createByteChunks,
  createUploadSession,
  metaDataToIotaFormat,
  metaDataFromIotaFormat,
  chunkToIotaFormat,
  chunkFromIotaFormat,
  createReader,
  mergeArrayBuffers
};
