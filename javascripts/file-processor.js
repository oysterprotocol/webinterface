const SECRET_KEY = "SecretKey";
const ENTROPY = "abc123";
const CHUNK_BYTE_SIZE = 30;

const createHandle = fileName => {
  const fileNameTrimmed = parseEightCharsOfFilename(fileName);
  const salt = getSalt(8);
  const primordialHash = getPrimordialHash(ENTROPY);
  const handle = fileNameTrimmed + primordialHash + salt;

  return handle;
};

const createByteChunks = file => {
  // This returns an array with the starting byte pointers
  // ex: For a 150 byte file it would return: [0, 31, 62, 93, 124]
  const byteLocations = _.range(0, file.size, CHUNK_BYTE_SIZE + 1);
  const byteChunks = _.map(byteLocations, (byte, index) => {
    return { chunkId: index, chunkStartingPoint: byte };
  });

  return byteChunks;
};

const uploadFileToBrokerNodes = file => {
  const byteChunks = createByteChunks(file);

  const firstHalfOfByteChunks = byteChunks.slice(0, byteChunks.length / 2);
  const lastHalfOfByteChunks = byteChunks.slice(
    byteChunks.length / 2,
    byteChunks.length
  );

  Promise.all([
    sendToAlphaBroker(firstHalfOfByteChunks, file),
    sendToBetaBroker(lastHalfOfByteChunks, file)
  ]).then(() => {
    console.log("Upload complete!");
  });
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

const chunkFile = (file, byteChunks, sliceCutOffFn) => {
  const handle = createHandle(file.name);

  byteChunks.forEach(byte => {
    const { chunkId, chunkStartingPoint } = byte;
    const reader = createReader(fileSlice => {
      document.getElementById("byte_content").textContent += encrypt(
        fileSlice,
        SECRET_KEY
      );
    });
    const blob = file.slice(
      chunkStartingPoint,
      sliceCutOffFn(chunkStartingPoint)
    );
    reader.readAsBinaryString(blob);
  });
};

const sendToAlphaBroker = (byteChunks, file) =>
  new Promise((resolve, reject) => {
    chunkFile(file, byteChunks, byteLocation => byteLocation + CHUNK_BYTE_SIZE);
    resolve();
  });

const sendToBetaBroker = (byteChunks, file) =>
  new Promise((resolve, reject) => {
    chunkFile(file, byteChunks.reverse(), byteLocation =>
      Math.min(file.size, byteLocation + CHUNK_BYTE_SIZE)
    );
    resolve();
  });
