import CryptoJS from "crypto-js";
import uuidv4 from "uuid/v4";

const parseEightCharsOfFilename = fileName => {
  fileName = fileName + "________";
  fileName = fileName.substr(0, 8);

  return fileName;
};

const getSalt = numChars => {
  const salt = Math.random()
    .toString(36)
    .substr(2, numChars);

  return salt;
};

const getPrimordialHash = () => {
  const entropy = uuidv4();
  return CryptoJS.SHA256(entropy).toString();
};

// Returns [obfuscatedHash, nextHash]
const hashChain = hash => {
  const obfuscatedHash = CryptoJS.SHA384(hash).toString();
  const nextHash = CryptoJS.SHA256(hash).toString();

  return [obfuscatedHash, nextHash];
};

// Genesis hash is not yet obfuscated.
const genesisHash = handle => {
  const [_obfuscatedHash, genHash] = hashChain(handle);

  return genHash;
};

const byteArrayToWordArray = (ba) => {
  let wa = [], i;
  for (i = 0; i < ba.length; i++) {
    wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
  }

  return CryptoJS.lib.WordArray.create(wa, ba.length);
};

const wordArrayToByteArray = (wordArray, length) => {
  if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
    length = wordArray.sigBytes;
    wordArray = wordArray.words;
  }

  let result = [],
    bytes,
    i = 0;
  while (length > 0) {
    bytes = wordToByteArray(wordArray[i], Math.min(4, length));
    length -= bytes.length;
    result.push(bytes);
    i++;
  }
  return [].concat.apply([], result);
};

const wordToByteArray = (word, length) => {
  let ba = [],
    xFF = 0xFF;
  if (length > 0)
    ba.push(word >>> 24);
  if (length > 1)
    ba.push((word >>> 16) & xFF);
  if (length > 2)
    ba.push((word >>> 8) & xFF);
  if (length > 3)
    ba.push(word & xFF);

  return ba;
};

function string2Bin(str) {
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return result;
}

function bin2String(array) {
  return String.fromCharCode.apply(String, array);
}

const encrypt = (byteArray, secretKey) =>
  CryptoJS.Rabbit.encrypt(byteArrayToWordArray(byteArray), secretKey).toString();

const decrypt = (text, secretKey) =>
  wordArrayToByteArray(CryptoJS.Rabbit.decrypt(text, secretKey));

const encryptMetaData = (text, secretKey) =>
  CryptoJS.AES.encrypt(text, secretKey).toString();

const decryptMetaData = (text, secretKey) =>
  CryptoJS.AES.decrypt(text, secretKey).toString(CryptoJS.enc.Utf8);


export default {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash,
  hashChain,
  genesisHash,
  encrypt,
  decrypt,
  decryptMetaData,
  encryptMetaData,
};
