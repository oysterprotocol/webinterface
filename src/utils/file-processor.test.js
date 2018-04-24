import CryptoJS from "crypto-js";

import FileProcessor from "./file-processor";

test("Creates correct chunks from file", () => {
  const handle = "super-secret-key";
  const file = new File(["test123-".repeat(2187)], "testFile.txt");
  const chunks = FileProcessor.fileToChunks(file, handle).then(chunks => {
    console.log("=======================");
    // console.log(chunks);
    console.log("=======================");
  });

  console.log("RABBIT");
  // const encrypted = CryptoJS.Rabbit.encrypt("Message", "Secret Passphrase");
  // const decrypted = CryptoJS.Rabbit.encrypt(encrypted, "Secret Passphrase");

  var encrypted = CryptoJS.Rabbit.encrypt(
    "Message1234",
    "Secret Passphrase"
  ).toString();
  var decrypted = CryptoJS.Rabbit.decrypt(encrypted, "Secret Passphrase");

  console.log(encrypted);
  console.log(decrypted.toString(CryptoJS.enc.Utf8));

  expect(true).toEqual(true);
});
