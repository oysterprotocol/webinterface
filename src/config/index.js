export const API = Object.freeze({
  HOST: "http://ALPHA_BROKER_IP",
  BROKER_NODE_A: "http://ALPHA_BROKER_IP",
  BROKER_NODE_B: "http://BETA_BROKER_IP",
  V1_UPLOAD_SESSIONS_PATH: ":3000/api/v1/upload-sessions",
  V2_UPLOAD_SESSIONS_PATH: ":3000/api/v2/upload-sessions",
  CHUNKS_PER_REQUEST: 10
});

export const IOTA_API = Object.freeze({
  PROVIDER_A: "http://ALPHA_BROKER_IP:14265",
  PROVIDER_B: "http://ALPHA_BROKER_IP:14265",
  PROVIDER_C: "http://ALPHA_BROKER_IP:14265",
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

export const INCLUDE_TREASURE_OFFSETS = false;
export const NUM_BROKER_CHANNELS = 3; // number of broker cores - 1
export const SECONDS_PER_CHUNK = 0.035; // if MWM is changed this will be incorrect
export const MAX_ADDRESSES = 1000;
