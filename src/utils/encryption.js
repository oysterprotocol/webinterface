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

const encrypt = message => CryptoJS.SHA256(message).toString();

const decrypt = (ciphertext, secretKey) =>
  CryptoJS.AES.decrypt(ciphertext, secretKey);

export default {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash,
  encrypt,
  decrypt
};
