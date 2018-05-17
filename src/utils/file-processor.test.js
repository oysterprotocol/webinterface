import fs from "fs";
import _ from "lodash";

import FileProcessor from "./file-processor";

const testFilePath = `${__dirname}/../test-files/file.png`;

const readTestFile = () =>
  new Promise((resolve, reject) => {
    fs.readFile(testFilePath, (err, data) => {
      if (err) return reject(err);
      const blob = new File(data, "file.png");
      return resolve(blob);
    });
  });

test("file |> fileToChunks |> chunksToFile - Success", done => {
  const handle = "super-secret-key";

  readTestFile().then(file => {
    FileProcessor.fileToChunks(file, handle)
      .then(encryptedChks => FileProcessor.chunksToFile(encryptedChks, handle))
      .then(decryptedBlob => FileProcessor.readBlobForTests(decryptedBlob))
      .then(reassembledFileContent => {
        FileProcessor.readBlobForTests(file).then(origFile => {
          expect(reassembledFileContent).toEqual(origFile);
          done();
        });
      })
      .catch(err => {
        expect(err).toBeFalsy();
        done();
      });
  });
});

test("file |> fileToChunks |> chunksToFile - Beta Success", done => {
  const handle = "super-secret-key";

  readTestFile().then(file => {
    FileProcessor.fileToChunks(file, handle)
      .then(encryptedChunks => {
        // Beta reverses chunks.
        encryptedChunks = encryptedChunks.reverse();
        return FileProcessor.chunksToFile(encryptedChunks, handle);
      })
      .then(decryptedBlob => FileProcessor.readBlobForTests(decryptedBlob))
      .then(reassembledFileContent => {
        FileProcessor.readBlobForTests(file).then(origFile => {
          expect(reassembledFileContent).toEqual(origFile);
          done();
        });
      })
      .catch(err => {
        expect(err).toBeFalsy();
        done();
      });
  });
});

test("file |> fileToChunks |> chunksToFile - Success w/ treasure", done => {
  const handle = "super-secret-key";
  const numTreasure = 100;

  readTestFile().then(file => {
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
      .then(decryptedBlob => FileProcessor.readBlobForTests(decryptedBlob))
      .then(reassembledFileContent => {
        FileProcessor.readBlobForTests(file).then(origFile => {
          expect(reassembledFileContent).toEqual(origFile);
          done();
        });
      })
      .catch(err => {
        expect(err).toBeFalsy();
        done();
      });
  });
});

test("file |> fileToChunks |> chunksToFile - Success w/ Meta", done => {
  const handle = "super-secret-key";

  readTestFile().then(file => {
    FileProcessor.fileToChunks(file, handle, { withMeta: true })
      .then(encryptedChks => _.tail(encryptedChks))
      .then(encryptedChks => FileProcessor.chunksToFile(encryptedChks, handle))
      .then(decryptedBlob => FileProcessor.readBlobForTests(decryptedBlob))
      .then(reassembledFileContent => {
        FileProcessor.readBlobForTests(file).then(origFile => {
          expect(reassembledFileContent).toEqual(origFile);
          done();
        });
      })
      .catch(err => {
        expect(err).toBeFalsy();
        done();
      });
  });
});

test("file |> fileToChunks |> chunksToFile - correct meta", done => {
  const handle = "super-secret-key";

  readTestFile().then(file => {
    FileProcessor.fileToChunks(file, handle, { withMeta: true })
      .then(encryptedChks => {
        const metaChunk = encryptedChks[0];

        const metaData = FileProcessor.metaDataFromIotaFormat(
          metaChunk.data,
          handle
        );

        expect(metaData).toEqual({
          fileName: "file.png",
          ext: "png",
          numberOfChunks: 16
        });
        done();
      })
      .catch(err => {
        expect(err).toBeFalsy();
        done();
      });
  });
});
