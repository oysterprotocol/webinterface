import CryptoJS from "crypto-js";

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

const getPrimordialHash = entropy => CryptoJS.SHA256(entropy).toString();

const getNextHash = (previousHash) =>
    CryptoJS.SHA256(previousHash).toString();

const encrypt = (message, secretKey) =>
  CryptoJS.AES.encrypt(message, secretKey).toString();

const decrypt = (ciphertext, secretKey) =>
  CryptoJS.AES.decrypt(ciphertext, secretKey);

export default {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash,
  getNextHash,
  encrypt,
  decrypt
};
