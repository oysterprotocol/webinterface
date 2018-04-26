import CryptoJS from "crypto-js";

import FileProcessor from "./file-processor";

test("Creates correct chunks from file", done => {
  const handle = "super-secret-key";
  const fileContents = "test123-".repeat(2187);
  const file = new File([fileContents], "testFile.txt");

  FileProcessor.fileToChunks(file, handle)
    .then(encrypted => FileProcessor.chunksToFile(encrypted, handle))
    .then(decryptedBlob => FileProcessor.readBlob(decryptedBlob))
    .then(fileData => {
      expect(fileData).toEqual(fileContents);
      done();
    })
    .catch(err => {
      expect(err).toBeFalsy();
      done();
    });
});
