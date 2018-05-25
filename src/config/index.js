const IS_DEV = process.env.NODE_ENV === "development";

// TODO: Script to set produciton values.
const ALPHA_IP = IS_DEV ? "52.14.218.135" : "ALPHA_IP";
const BETA_IP = IS_DEV ? "18.217.133.146" : "BETA_IP";

export const API = Object.freeze({
  BROKER_NODE_A: `http://${ALPHA_IP}`,
  BROKER_NODE_B: `http://${BETA_IP}`,
  V1_UPLOAD_SESSIONS_PATH: ":3000/api/v1/upload-sessions",
  V2_UPLOAD_SESSIONS_PATH: ":3000/api/v2/upload-sessions",
  GAS_PRICE: "https://api.blockcypher.com/v1/eth/main",
  CHUNKS_PER_REQUEST: 10
});

export const IOTA_API = Object.freeze({
  PROVIDER_A: `http://${ALPHA_IP}:14265`,
  PROVIDER_B: `http://${BETA_IP}:14265`,
  PROVIDER_C: `http://${ALPHA_IP}:14265`,
  ADDRESS_LENGTH: 81,
  MESSAGE_LENGTH: 2187,
  BUNDLE_SIZE: 100
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
  MAX_FILE_SIZE: 2000 * 1000,
  CHUNK_TYPES: {
    METADATA: "METADATA",
    FILE_CONTENTS: "FILE_CONTENTS"
  }
});

export const INCLUDE_TREASURE_OFFSETS = true;
export const NUM_BROKER_CHANNELS = 3; // number of broker cores - 1
export const SECONDS_PER_CHUNK = 0.035; // if MWM is changed this will be incorrect
export const MAX_ADDRESSES = 1000;
export const NUM_POLLING_ADDRESSES = 101;
