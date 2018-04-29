import CryptoJS from "crypto-js";

import FileProcessor from "./file-processor";

test("file |> fileToChunks |> chunksToFile - Success", done => {
  const handle = "super-secret-key";
  const ogFileContents = "test123-".repeat(5000);
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

test("file |> fileToChunks |> chunksToFile - Beta Success", done => {
  const handle = "super-secret-key";
  const ogFileContents = "test123-".repeat(5000);
  const file = new File([ogFileContents], "testFile.txt");

  FileProcessor.fileToChunks(file, handle)
    .then(encryptedChunks => {
      // Beta reverses chunks.
      encryptedChunks = encryptedChunks.reverse();
      return FileProcessor.chunksToFile(encryptedChunks, handle);
    })
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

test("file |> fileToChunks |> chunksToFile - Success w/ treasure", done => {
  const handle = "super-secret-key";
  const ogFileContents = "test123-".repeat(5000);
  const file = new File([ogFileContents], "testFile.txt");
  const numTreasure = 100;

  FileProcessor.fileToChunks(file, handle)
    .then(encryptedChunks => {
      const ogLen = encryptedChunks.length;
      // Insert treasure randomly into chunks.
      for (let i = 0; i < numTreasure; i++) {
        let maxIdx = ogLen + i;
        let treasureIdx = Math.floor(Math.random() * maxIdx);
        encryptedChunks.splice(treasureIdx, 0, {
          idx: treasureIdx,
          data: "TREASURE"
        });
      }

      return FileProcessor.chunksToFile(encryptedChunks, handle);
    })
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
