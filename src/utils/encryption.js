import _ from "lodash";
import forge from "node-forge";
import Raven from "raven-js";
import analytics from "analytics.js";

const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const CHUNK_PREFIX = "File_chunk_data: ";
const CHUNK_PREFIX_IN_HEX = forge.util.bytesToHex(CHUNK_PREFIX);

export function bytesFromHandle(handle) {
  return forge.md.sha256
    .create()
    .update(handle, "utf8")
    .digest();
}

const parseHandleFilenameShortname = fileName => {
  // discuss how to handle 'illegal' characters, strip for now
  fileName = fileName.replace(/[^\w-]/, "")
  fileName = fileName + getSalt(8);
  fileName = fileName.substr(0, 8);

  return fileName;
};

// `length` should be a multiple of 2
export function getSalt(length) {
  const bytes = forge.random.getBytesSync(length);
  const byteArr = forge.util.binary.raw.decode(bytes);
  const salt = forge.util.binary.base58.encode(byteArr);
  return salt.substr(0, length);
}

export function getNonce(key, idx) {
  const nonce = forge.util.binary.hex.decode(idx.toString(16));
  return forge.md.sha384
    .create()
    .update(key.bytes())
    .update(nonce)
    .digest()
    .getBytes(IV_LENGTH);
}

export function getPrimordialHash() {
  const bytes = forge.random.getBytesSync(16);
  return forge.md.sha256
    .create()
    .update(bytes)
    .digest()
    .toHex();
}

// Expects byteString as input
// Returns [obfuscatedHash, nextHash] as byteString
export function hashChain(byteStr) {
  const obfuscatedHash = forge.md.sha384
    .create()
    .update(byteStr)
    .digest()
    .bytes();
  const nextHash = forge.md.sha256
    .create()
    .update(byteStr)
    .digest()
    .bytes();

  return [obfuscatedHash, nextHash];
}

// First hash in the datamap
const obfuscatedGenesisHash = hash => {
  const byteStr = forge.util.hexToBytes(hash);
  const [obfuscatedHash, _genHash] = hashChain(byteStr);

  return forge.util.bytesToHex(obfuscatedHash);
};

const encryptChunk = (key, idx, secret) => {
  key.read = 0;
  const iv = getNonce(key, idx);
  const cipher = forge.cipher.createCipher("AES-GCM", key);

  cipher.start({
    iv: iv,
    tagLength: TAG_LENGTH * 8,
    additionalData: "binary-encoded string"
  });

  cipher.update(forge.util.createBuffer(secret));
  cipher.finish();

  return cipher.output.bytes() + cipher.mode.tag.bytes() + iv;
};

const decryptChunk = (key, secret) => {
  key.read = 0;

  // Require a payload of at least one byte to attempt decryption
  if (secret.length <= IV_LENGTH + TAG_LENGTH) {
    return "";
  }

  const iv = secret.substr(-IV_LENGTH);
  const tag = secret.substr(-TAG_LENGTH - IV_LENGTH, TAG_LENGTH);
  const decipher = forge.cipher.createDecipher("AES-GCM", key);

  decipher.start({
    iv: iv,
    tag: tag,
    tagLength: TAG_LENGTH * 8,
    additionalData: "binary-encoded string"
  });

  decipher.update(
    forge.util.createBuffer(
      secret.substring(0, secret.length - TAG_LENGTH - IV_LENGTH)
    )
  );

  // Most likely a treasure chunk, skip
  if (!decipher.finish()) {
    return "";
  }

  return decipher.output.bytes();
};

export default {
  parseHandleFilenameShortname,
  getSalt,
  getPrimordialHash,
  hashChain,
  obfuscatedGenesisHash,
  encryptChunk,
  decryptChunk,
  bytesFromHandle
};
