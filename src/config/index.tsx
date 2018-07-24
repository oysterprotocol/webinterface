export const IS_DEV = process.env.NODE_ENV === "development";

const PROTOCOL = IS_DEV ? "http" : "https";

const POLLING_NODE = IS_DEV
  ? ["18.191.77.193"] // Travis broker
  : ["poll.oysternodes.com"];

const BROKERS = IS_DEV
  ? ["18.222.56.121", "18.191.77.193"] // Travis brokers
  : //["18.188.64.13", "18.188.230.212"] // Rebel brokers
    //["52.14.218.135", "18.217.133.146"] // QA brokers
    ["broker-3.oysternodes.com", "broker-4.oysternodes.com"];

// Hack until we have proper load balancing.
const randElem = (xs: string) => xs[Math.floor(Math.random() * xs.length)];
const randBrokers = (brokers: any) => {
  const alpha = randElem(brokers);
  const remBrokers = brokers.filter((br: any) => br != alpha);
  const beta = randElem(remBrokers);

  return [alpha, beta];
};

const [ALPHA_IP, BETA_IP] = randBrokers(BROKERS);

export const API = Object.freeze({
  BROKER_NODE_A: `${PROTOCOL}://${ALPHA_IP}`,
  BROKER_NODE_B: `${PROTOCOL}://${BETA_IP}`,
  V2_UPLOAD_SESSIONS_PATH: ":3000/api/v2/upload-sessions",
  V2_STATUS_PATH: ":3000/api/v2/status",
  GAS_PRICE: "https://api.blockcypher.com/v1/eth/main",
  CHUNKS_PER_REQUEST: 10
});

export const IOTA_API = Object.freeze({
  PROVIDER_A: `${PROTOCOL}://${POLLING_NODE}:14265`,
  PROVIDER_B: `${PROTOCOL}://${ALPHA_IP}:14265`,
  PROVIDER_C: `${PROTOCOL}://${BETA_IP}:14265`,
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
  PENDING: "PENDING",
  STANDBY: "STANDBY"
});

export const FILE = Object.freeze({
  MAX_FILE_SIZE: 100 * 1000 * 1000, // 100mb
  CHUNK_TYPES: {
    METADATA: "METADATA",
    FILE_CONTENTS: "FILE_CONTENTS"
  }
});

export const FEAT_FLAG = Object.freeze({
  STREAMING_UPLOAD: true,
  STREAMING_DOWNLOAD: true
});

export const INCLUDE_TREASURE_OFFSETS = true;
export const MAX_ADDRESSES = 1000;
export const NUM_POLLING_ADDRESSES = 301;
export const IOTA_POLL_INTERVAL = 2000;
