export const API = Object.freeze({
  // HOST: "http://localhost:8000",
  // BROKER_NODE_A: "http://localhost:8000",
  // BROKER_NODE_B: "http://localhost:8000",
  HOST: "https://broker-1.oysternodes.com",
  BROKER_NODE_A: "https://broker-1.oysternodes.com",
  BROKER_NODE_B: "https://broker-2.oysternodes.com",
  V1_UPLOAD_SESSIONS_PATH: "/api/v1/upload-sessions",
  CHUNKS_PER_REQUEST: 10
});

export const IOTA_API = Object.freeze({
  PROVIDER_A: "http://eugene.iota.community:14265",
  PROVIDER_B: "http://eugene.iotasupport.com:14999",
  PROVIDER_C: "http://eugeneoldisoft.iotasupport.com:14265",
  ADDRESS_LENGTH: 81,
  MESSAGE_LENGTH: 2187
});

export const UPLOAD_STATUSES = Object.freeze({
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED"
});

export const DOWNLOAD_STATUSES = Object.freeze({
  STANDBY: "STANDBY",
  PENDING: "PENDING",
  RECEIVED: "RECEIVED",
  FAILED: "FAILED"
});

export const FILE = Object.freeze({
  MAX_FILE_SIZE: 100 * 1000,
  CHUNK_TYPES: {
    METADATA: "METADATA",
    FILE_CONTENTS: "FILE_CONTENTS"
  }
});
