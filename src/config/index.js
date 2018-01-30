export const API = Object.freeze({
  // HOST: "http://localhost:8000",
  // BROKER_NODE_A: "http://localhost:8000",
  // BROKER_NODE_B: "http://localhost:8000",
  HOST: "https://broker-1.oysternodes.com",
  BROKER_NODE_A: "https://broker-1.oysternodes.com",
  BROKER_NODE_B: "https://broker-2.oysternodes.com",
  V1_UPLOAD_SESSIONS_PATH: "/api/v1/upload-sessions"
});

export const IOTA_API = Object.freeze({
  PROVIDER: "http://eugene.iota.community:14265",
  ADDRESS_LENGTH: 81
});

export const UPLOAD_STATUSES = Object.freeze({
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED"
});

export const FILE = Object.freeze({
  CHUNK_BYTE_SIZE: 1000
});
