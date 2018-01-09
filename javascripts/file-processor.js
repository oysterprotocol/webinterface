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

  Promise.all([
    sendToAlphaBroker(byteChunks, file),
    sendToBetaBroker(byteChunks, file)
  ]).then(() => {
    console.log("Upload complete! ", sentChunks);
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

const sentChunks = {};
const sendChunkToNode = (chunkId, fileSlice, handle) => {
  if (!!sentChunks[chunkId]) {
    return;
  }

  // TODO: wrap this in promise and actually send the chunks to nodes
  const encryptedChunk = encrypt(fileSlice, handle);
  sentChunks[chunkId] = encryptedChunk;

  return encryptedChunk;
};

const chunkFile = (file, byteChunks, sliceCutOffFn) => {
  const handle = createHandle(file.name);

  return byteChunks.map(byte => {
    const { chunkId, chunkStartingPoint } = byte;
    const blob = file.slice(
      chunkStartingPoint,
      sliceCutOffFn(chunkStartingPoint)
    );

    const reader = createReader(fileSlice => {
      sendChunkToNode(chunkId, fileSlice, handle);
    });
    return reader.readAsBinaryString(blob);
  });
};

const sendToAlphaBroker = (byteChunks, file) =>
  new Promise((resolve, reject) => {
    const blobs = chunkFile(
      file,
      byteChunks,
      byteLocation => byteLocation + CHUNK_BYTE_SIZE
    );
    resolve(blobs);
  });

const sendToBetaBroker = (byteChunks, file) =>
  new Promise((resolve, reject) => {
    const blobs = chunkFile(file, byteChunks.reverse(), byteLocation =>
      Math.min(file.size, byteLocation + CHUNK_BYTE_SIZE)
    );
    resolve(blobs);
  });

const buildMetaDataPacket = (name, extension, handle) => {
  const metaData = assembleMetaData(name, extension);
  const encryptedMetaData = encrypt(metaData, handle);

  return encryptedMetaData;
};

const assembleMetaData = (name, extension) => {
  const metaData = { fname: name, ext: extension };
  return JSON.stringify(metaData);
};

// TODO: put this in an actual spec test
const testAddMetaData = handle => {
  const name = "test1";
  const ext = "png";
  const split_size = 30;

  const metaDataPacket = buildMetaDataPacket(name, ext, handle);

  //decrypt and see if we can get the json back
  const decryptedMetaData = decrypt(metaDataPacket, handle);
  console.log(JSON.parse(decryptedMetaData).fname == name);
};
