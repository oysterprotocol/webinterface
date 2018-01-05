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
  const byteChunks = _.range(0, file.size, CHUNK_BYTE_SIZE + 1);

  const firstHalfOfBytes = byteChunks.slice(0, byteChunks.length / 2);
  const lastHalfOfBytes = byteChunks.slice(
    byteChunks.length / 2,
    byteChunks.length
  );

  sendToAlphaBroker(firstHalfOfBytes, file);
  sendToBetaBroker(lastHalfOfBytes, file);
};

const sendToAlphaBroker = (byteChunks, file) => {
  console.log("FIRST HALF: ", byteChunks);
};

const sendToBetaBroker = (byteChunks, file) => {
  console.log("LAST HALF: ", byteChunks);
};
