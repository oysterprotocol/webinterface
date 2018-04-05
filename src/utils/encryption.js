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
const hashChain = msg => {
  const obfuscatedHash = CryptoJS.SHA384(msg).toString();
  const nextHash = CryptoJS.SHA256(message).toString();

  return [obfuscatedHash, nextHash];
};

// Genesis hash is not yet obfuscated.
const genesisHash = handle => {
  const [_, genHash] = hashChain(handle);

  return genHash;
};

const encrypt = (text, secretKey) =>
  CryptoJS.AES.encrypt(text, secretKey).toString();

const decrypt = (text, secretKey) =>
  CryptoJS.AES.decrypt(text, secretKey).toString(CryptoJS.enc.Utf8);

export default {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash,
  hashChain,
  genesisHash,
  encrypt,
  decrypt
};
