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
    .update(handle)
    .digest();
}

const parseEightCharsOfFilename = fileName => {
  fileName = fileName + getSalt(8);
  fileName = fileName.substr(0, 8);

  return fileName;
};

// `length` should be a multiple of 8
export function getSalt(length) {
  const bytes = forge.random.getBytesSync(Math.ceil(length / 8 * 6));
  return forge.util.encode64(bytes);
}

export function getPrimordialHash() {
  const bytes = forge.random.getBytesSync(16);
  return forge.md.sha256
    .create()
    .update(bytes)
    .digest()
    .toHex();
}

// Returns [obfuscatedHash, nextHash]
export function hashChain(hash) {
  const obfuscatedHash = forge.md.sha384
    .create()
    .update(hash)
    .digest()
    .toHex();
  const nextHash = forge.md.sha256
    .create()
    .update(hash)
    .digest()
    .toHex();

  return [obfuscatedHash, nextHash];
}
// Genesis hash is not yet obfuscated.
const genesisHash = handle => {
  const [_obfuscatedHash, genHash] = hashChain(handle);

  return genHash;
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
  encryptChunk,
  decryptChunk,
  bytesFromHandle
};
