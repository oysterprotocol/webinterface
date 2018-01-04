const buildOysterHandle = (fileName, entropy) => {
  const fileNameTrimmed = parseEightCharsOfFilename(fileName);
  const salt = getSalt(8);
  const primordialHash = getPrimordialHash(entropy);
  const handle = fileNameTrimmed + primordialHash + salt;

  return handle;
};

// TODO: scope these variables
const encryptedFileChunksDictionary = new Object();
const originalFileChunksDictionary = {};

let chunkId = 0;
let oy_stopByte = 0;
let handle;
let oy_split_size = 30;

const oy_cycle = oy_pointer => {
  oy_startByte = oy_pointer;
  oy_stopByte = oy_startByte + oy_split_size;
  const files = document.getElementById("files").files;
  if (!files.length) {
    alert("Please select a file!");
    return;
  }
  const file = files[0];
  if (oy_stopByte > file.size) {
    oy_stopByte = file.size;
  }
  const start = parseInt(oy_startByte) || 0;
  const stop = parseInt(oy_stopByte) || file.size - 1;
  const reader = new FileReader();
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) {
      // DONE == 2
      document.getElementById("byte_content").textContent += evt.target.result;
      //document.write(evt.target.result);
      //document.getElementById('byte_range').textContent = ['Read bytes: ', start + 1, ' - ', stop + 1, ' of ', file.size, ' byte file'].join('');

      //encrypt chunk and add to chunk dictionary
      const bytes = evt.target.result;
      const encrypted = encrypt(bytes, handle);

      //console.log("bytes");
      //console.log(bytes);
      //console.log(encrypted.toString());

      encryptedFileChunksDictionary[chunkId] = encrypted;
      originalFileChunksDictionary[chunkId] = bytes;
      chunkId = chunkId + 1;

      //console.log(encryptedFileChunksDictionary);
      //add to

      if (oy_stopByte < file.size) {
        oy_cycle(oy_stopByte + 1);
      } else {
        testDecryptedChunkMatchesOriginalChunk();
        testEncryptedChunkDoesNotMatchOriginalChunk();
      }
    }
  };
  const blob = file.slice(start, stop + 1);
  reader.readAsBinaryString(blob);
};

// TODO: Need more exhaustive tests and to move into test file
const testDecryptedChunkMatchesOriginalChunk = function() {
  console.log(
    originalFileChunksDictionary["0"] ==
      decrypt(encryptedFileChunksDictionary["0"], handle)
  );
};
const testEncryptedChunkDoesNotMatchOriginalChunk = function() {
  console.log(
    originalFileChunksDictionary["0"] == encryptedFileChunksDictionary["0"]
  );

  console.log("number of chunks: " + chunkId.toString());
};
