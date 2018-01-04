const parseEightCharsOfFilename = fileName => {
  fileName = fileName + "________";
  fileName = fileName.substr(0, 8);

  return fileName;
};

const getSalt = numChars => {
  const salt = Math.random()
    .toString(36)
    .substr(2, 5);

  return salt;
};

const getPrimordialHash = entropy => {
  return CryptoJS.SHA256(entropy);
};

const encrypt = (message, secretkey) => {
  const ciphertext = CryptoJS.AES.encrypt(message, secretkey);
  return ciphertext.toString();
};

const decrypt = (ciphertext, secretkey) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretkey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// TESTING:  MOVE TO DIFFERENT FILE
// console.log("salt");
// console.log(getSalt(8));

// oyster handle NEED TESTS FOR LESS THAN AND MORE THAN 8 CHAR Fname
// const h = buildOysterHandle("test1", "abc");

// console.log("handle");
// console.log(h);
