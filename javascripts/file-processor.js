const buildOysterHandle = (fileName, entropy) => {
  const fileNameTrimmed = parseEightCharsOfFilename(fileName);
  const salt = getSalt(8);
  const primordialHash = getPrimordialHash(entropy);
  const handle = fileNameTrimmed + primordialHash + salt;

  return handle;
};

const CHUNK_BYTE_SIZE = 30;

const uploadFileToBrokerNodes = file => {
  // This returns an array with the starting byte pointers
  // ex: For a 150 byte file it would return: [0, 31, 62, 93, 124]
  const byteLocations = _.range(0, file.size, CHUNK_BYTE_SIZE + 1);
  const byteChunks = _.map(byteLocations, (byte, index) => {
    return { chunkId: index, chunkStartingPoint: byte };
  });

  const firstHalfOfByteChunks = byteChunks.slice(0, byteChunks.length / 2);
  const lastHalfOfByteChunks = byteChunks.slice(
    byteChunks.length / 2,
    byteChunks.length
  );

  sendToAlphaBroker(firstHalfOfByteChunks, file);
  sendToBetaBroker(lastHalfOfByteChunks, file);
};

const createReader = onRead => {
  const reader = new FileReader();
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) {
      onRead(evt.target.result);
    }
  };
  return reader;
};

const sendToAlphaBroker = (byteChunks, file) => {
  new Promise((resolve, reject) => {
    byteChunks.forEach(byte => {
      // TODO: Do something with byte.chunkId (the index)
      const { chunkStartingPoint } = byte;
      const reader = createReader(content => {
        document.getElementById("byte_content").textContent += content;
      });
      const blob = file.slice(
        chunkStartingPoint,
        chunkStartingPoint + CHUNK_BYTE_SIZE
      );
      reader.readAsBinaryString(blob);
    });
    resolve();
  });
};

const sendToBetaBroker = (byteChunks, file) => {
  new Promise((resolve, reject) => {
    byteChunks.reverse().forEach(byte => {
      // TODO: Do something with byte.chunkId (the index)
      const { chunkStartingPoint } = byte;
      const reader = createReader(content => {
        document.getElementById("byte_content").textContent += content;
      });
      const blob = file.slice(
        chunkStartingPoint,
        Math.min(file.size, chunkStartingPoint + CHUNK_BYTE_SIZE)
      );
      reader.readAsBinaryString(blob);
    });
    resolve();
  });
};
