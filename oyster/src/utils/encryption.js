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

const getPrimordialHash = entropy => {
  return CryptoJS.SHA256(entropy);
};

const encrypt = (message, secretKey) => {
  const ciphertext = CryptoJS.AES.encrypt(message, secretKey);
  return ciphertext.toString();
};

const decrypt = (ciphertext, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export default { parseEightCharsOfFilename, getSalt, getPrimordialHash };
