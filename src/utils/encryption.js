import _ from "lodash";
import forge from "node-forge";
import Raven from "raven-js";
import analytics from "analytics.js";

const IV_LENGTH = 16;
const CHUNK_PREFIX = "File_chunk_data: ";
const CHUNK_PREFIX_IN_HEX = forge.util.bytesToHex(CHUNK_PREFIX);

export function bytesFromHandle(handle) {
  return forge.md.sha256
    .create()
    .update(handle, "utf8")
    .digest();
}

const parseEightCharsOfFilename = fileName => {
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

// Expects the handle
// Genesis hash is not yet obfuscated.
const genesisHash = handle => {
  const primordialHash = handle.substr(8, 64);
  const byteStr = forge.util.hexToBytes(primordialHash);
  const [_obfuscatedHash, genHash] = hashChain(byteStr);

  return forge.util.bytesToHex(genHash);
};

// First hash in the datamap
const obfuscatedGenesisHash = hash => {
  const byteStr = forge.util.hexToBytes(hash);
  const [obfuscatedHash, _genHash] = hashChain(byteStr);

  return forge.util.bytesToHex(obfuscatedHash);
};

const encryptChunk = (key, secret) => {
  key.read = 0;
  const iv = forge.random.getBytesSync(16);
  const cipher = forge.cipher.createCipher("AES-GCM", key);

  cipher.start({
    iv: iv,
    tagLength: 0
  });

  cipher.update(forge.util.createBuffer(CHUNK_PREFIX + secret));
  cipher.finish();

  return cipher.output.getBytes() + iv;
};

const decryptChunk = (key, secret) => {
  key.read = 0;
  const iv = secret.substr(-IV_LENGTH);
  const decipher = forge.cipher.createDecipher("AES-GCM", key);

  decipher.start({
    iv: iv,
    tagLength: 0,
    output: null
  });

  decipher.update(
    forge.util.createBuffer(secret.substring(0, secret.length - IV_LENGTH))
  );

  if (!decipher.finish()) {
    let msg =
      "decipher failed to finished in decryptChunk in utils/encryption.js";
    Raven.captureException(new Error(msg));
    return "";
  }

  const hexedOutput = forge.util.bytesToHex(decipher.output);

  if (_.startsWith(hexedOutput, CHUNK_PREFIX_IN_HEX)) {
    return forge.util.hexToBytes(
      hexedOutput.substr(CHUNK_PREFIX_IN_HEX.length, hexedOutput.length)
    );
  } else {
    return "";
  }
};

export default {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash,
  hashChain,
  genesisHash,
  obfuscatedGenesisHash,
  encryptChunk,
  decryptChunk,
  bytesFromHandle
};
