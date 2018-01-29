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

const sha256 = message => CryptoJS.SHA256(message).toString();

const encrypt = (text, secretKey) =>
  CryptoJS.AES.encrypt(text, secretKey).toString();

const decrypt = (text, secretKey) =>
  CryptoJS.AES.decrypt(text, secretKey).toString(CryptoJS.enc.Utf8);

export default {
  parseEightCharsOfFilename,
  getSalt,
  getPrimordialHash,
  sha256,
  encrypt,
  decrypt
};
