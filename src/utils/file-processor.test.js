import CryptoJS from "crypto-js";

import FileProcessor from "./file-processor";

test("Creates correct chunks from file", done => {
  const handle = "super-secret-key";
  const ogFileContents = "test123-".repeat(2187);
  const file = new File([ogFileContents], "testFile.txt");

  FileProcessor.fileToChunks(file, handle)
    .then(encryptedChks => FileProcessor.chunksToFile(encryptedChks, handle))
    .then(decryptedBlob => FileProcessor.readBlob(decryptedBlob))
    .then(reassembledFileContent => {
      expect(reassembledFileContent).toEqual(ogFileContents);
      done();
    })
    .catch(err => {
      expect(err).toBeFalsy();
      done();
    });
});
